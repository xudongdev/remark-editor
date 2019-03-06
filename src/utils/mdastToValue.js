import omit from "lodash/omit";
import { Value } from "slate";

const inlineTypes = ["emphasis", "strong", "inlineCode"];

function changeNode(node) {
  return [
    {
      object: inlineTypes.indexOf(node.type) < 0 ? "block" : "inline",
      type: node.type,
      data: omit(node, ["type", "children", "position"]) || {},
      nodes: node.value
        ? [{ object: "text", text: node.value }]
        : node.children
        ? changeNodes(node.children)
        : undefined
    }
  ];
}

function changeText(node) {
  // 清除零宽空格
  if (node.value === "\u200B") return [];

  return [
    {
      object: "text",
      leaves: [
        {
          marks: [],
          object: "leaf",
          text: node.value
        }
      ]
    }
  ];
}

function changeBreak() {
  return [{ object: "inline", type: "break" }];
}

function changeNodes(nodes) {
  let output = [];
  nodes.forEach(node => {
    output = [
      ...output,
      ...(node => {
        if (node.type === "html") return [];
        if (node.type === "text") return changeText(node);
        if (node.type === "break") return changeBreak(node);
        return changeNode(node);
      })(node)
    ];
  });
  return output;
}

export default function(mdast) {
  const value = Value.fromJSON({
    object: "value",
    document: {
      object: "document",
      data: {},
      nodes: mdast.children ? changeNodes(mdast.children) : []
    }
  });

  return value;
}
