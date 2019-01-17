import uniqBy from "lodash/uniqBy";
import { Text } from "slate";

const blockContent = [
  { type: "paragraph" },
  { type: "heading" },
  { type: "thematicBreak" },
  { type: "blockquote" },
  { type: "list" },
  // { type: "table" },
  // { type: "html" },
  { type: "code" }
];

const listContent = [{ type: "listItem" }];

const staticPhrasingContent = [
  { object: "text" },
  { type: "emphasis" },
  { type: "strong" },
  { type: "delete" },
  // { type: "html" },
  { type: "inlineCode" },
  { type: "break" },
  { type: "image" }
  // { type: "imageReference" },
  // { type: "footnote" },
  // { type: "footnoteReference" }
];

const phrasingContent = uniqBy(
  [
    ...staticPhrasingContent,
    { type: "link" }
    // { type: "linkReference" }
  ],
  "type"
);

function normalizeChildTypeInvalid(editor, error, block = "paragraph") {
  if (error.code === "child_type_invalid") {
    if (Text.isText(error.child)) {
      editor.wrapBlockByKey(error.child.key, block);
    } else {
      editor.unwrapBlockByKey(error.child.key);
    }
    return true;
  }
}

const schema = {
  document: {
    nodes: [
      {
        min: 1,
        match: blockContent
      }
    ],
    normalize: (editor, error) => {
      switch (error.code) {
        case "child_type_invalid":
          console.error("文档出现了不该出现的块", error.child);
          return editor.setNodeByKey(error.child.key, { type: "paragraph" });
        case "child_min_invalid":
          console.log("文档最少要有一个块");
          return editor.insertNodeByKey(editor.value.document.key, 0, {
            object: "block",
            type: "paragraph"
          });
        default:
      }
    }
  },
  blocks: {
    paragraph: { nodes: [{ match: phrasingContent }] },
    heading: { nodes: [{ match: phrasingContent }] },
    thematicBreak: { isVoid: true },
    blockquote: {
      nodes: [{ match: blockContent }],
      normalize: (editor, error) => {
        if (normalizeChildTypeInvalid(editor, error, "paragraph")) return;
        console.error("blockquote 格式化错误", error);
      }
    },
    list: {
      nodes: [{ match: listContent }],
      normalize: (editor, error) => {
        if (normalizeChildTypeInvalid(editor, error, "listItem")) return;
        console.error("list 格式化错误", error.child);
      }
    },
    listItem: {
      nodes: [{ match: blockContent }],
      normalize: (editor, error) => {
        if (normalizeChildTypeInvalid(editor, error, "paragraph")) return;
        console.error("listItem 格式化错误", error.child);
      }
    },
    // table: {},
    // tableRow: {},
    // tableCell: {},
    // html: {},
    code: {}
    // yaml: {},
    // definition: {},
    // footnoteDefinition: { nodes: [{ match: blockContent }] }
  },
  inlines: {
    emphasis: { nodes: [{ match: phrasingContent }] },
    strong: { nodes: [{ match: phrasingContent }] },
    delete: { nodes: [{ match: phrasingContent }] },
    inlineCode: {},
    break: { isVoid: true },
    link: { nodes: [{ match: staticPhrasingContent }] },
    image: { isVoid: true }
    // linkReference: { nodes: [{ match: staticPhrasingContent }] },
    // imageReference: { isVoid: true },
    // footnote: { nodes: [{ match: phrasingContent }] },
    // footnoteReference: { isVoid: true }
  }
};

export default schema;
