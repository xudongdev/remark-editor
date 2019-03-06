function changeNode(node) {
  return [
    {
      type: node.type,
      ...node.data.toJSON(),
      children: changeNodes(node.nodes.toArray())
    }
  ];
}

function changeBreak(node, nodes) {
  if (nodes[nodes.length - 2] === node && nodes[nodes.length - 1].text === "") {
    return [{ type: "break" }, { type: "text", value: "\u200B" }];
  }

  return [{ type: "break" }];
}

function changeText(node) {
  const value = node.leaves.map(leaf => leaf.text).join("");

  return value.length > 0
    ? [
        {
          type: "text",
          value
        }
      ]
    : [];
}

function changeCode(node) {
  return [
    {
      type: node.type,
      lang: node.data.get("lang"),
      meta: node.data.get("meta"),
      value: node.text
    }
  ];
}

function changeInlineCode(node) {
  return [
    {
      type: node.type,
      value: node.text
    }
  ];
}

function changeParagraph(node) {
  if (node.sizes === 0) {
    return [
      {
        type: "paragraph",
        children: [{ type: "text", value: "\u200B" }]
      }
    ];
  }

  return changeNode(node);
}

function changeNodes(nodes) {
  let output = [];
  nodes.forEach(node => {
    output = [
      ...output,
      ...(node => {
        if (node.type === "break") return changeBreak(node, nodes);
        if (node.object === "text") return changeText(node);
        if (node.type === "code") return changeCode();
        if (node.type === "inlineCode") return changeInlineCode(node);
        if (node.type === "paragraph") return changeParagraph(node);
        return changeNode(node);
      })(node)
    ];
  });
  return output;
}

export default function(value) {
  const mdast = {
    type: "root",
    children: changeNodes(value.document.nodes.toArray())
  };

  console.log("VALUE", value.toJSON());
  console.log("MDAST", mdast);

  return mdast;
}
