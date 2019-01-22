function changeNode(node) {
  if (node.type === "break") {
    return { type: "break" };
  }

  if (node.object === "text") {
    const value = node.leaves.map(leaf => leaf.text).join("");

    return value.length > 0
      ? {
          type: "text",
          value
        }
      : null;
  }

  if (node.type === "code") {
    return {
      type: node.type,
      lang: node.data.get("lang"),
      meta: node.data.get("meta"),
      value: node.text
    };
  }

  if (node.type === "inlineCode") {
    return {
      type: node.type,
      value: node.text
    };
  }

  // if (node.type === "paragraph" && node.text.length === 0) {
  //   return null;
  // }

  return {
    type: node.type,
    ...node.data.toJSON(),
    children: changeNodes(node.nodes)
  };
}

function changeNodes(nodes) {
  return nodes
    .toArray()
    .map(changeNode)
    .filter(node => node);
}

export default function(value) {
  const mdast = {
    type: "root",
    children: changeNodes(value.document.nodes)
  };

  // console.log("VALUE", value.toJSON());
  console.log("MDAST", mdast);

  return mdast;
}
