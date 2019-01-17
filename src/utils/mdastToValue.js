import omit from "lodash/omit";
import { Value } from "slate";

const inlineTypes = ["emphasis", "strong", "inlineCode"];

function changeNode(node) {
  if (node.type === "html") {
    return null;
  }

  if (node.type === "text") {
    return {
      object: "text",
      leaves: [
        {
          marks: [],
          object: "leaf",
          text: node.value
        }
      ]
    };
  }

  if (node.type === "break") {
    return { object: "inline", type: "break" };
  }

  const result = {};
  result.object = inlineTypes.indexOf(node.type) < 0 ? "block" : "inline";
  result.type = node.type;
  result.data = omit(node, ["type", "children", "position"]) || {};

  if (node.value) {
    result.nodes = [{ object: "text", text: node.value }];
  } else if (node.children) {
    result.nodes = node.children.map(changeNode).filter(n => n);
  }

  return result;
}

export default function(mdast) {
  const json = {
    object: "value",
    document: {
      object: "document",
      data: {},
      nodes: []
    }
  };

  if (mdast.children) {
    json.document.nodes = mdast.children.map(changeNode).filter(n => n);
  }

  // console.log("***", json);
  // console.log("###", Value.fromJSON(json).toJSON());

  return Value.fromJSON(json);
}
