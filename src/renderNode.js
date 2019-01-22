import React from "react";
import Heading from "./compoents/Heading";
import Code from "./compoents/Code";
import List from "./compoents/List";
import ListItem from "./compoents/ListItem";
import Paragraph from "./compoents/Paragraph";
import Blockquote from "./compoents/Blockquote";

export default function renderNode(props, editor, next) {
  const { attributes, children, node } = props;

  switch (node.type) {
    case "heading":
      return <Heading {...props} />;
    case "paragraph":
      return <Paragraph {...props} editor={editor} />;
    case "code":
      return <Code {...props} />;
    case "list":
      return <List {...props} />;
    case "listItem":
      return <ListItem {...props} />;
    case "blockquote":
      return <Blockquote {...props} />;
    case "emphasis":
      return <em {...attributes}>{children}</em>;
    case "strong":
      return <strong {...attributes}>{children}</strong>;
    case "delete":
      return <del {...attributes}>{children}</del>;
    case "inlineCode":
      return <code {...attributes}>{children}</code>;
    case "thematicBreak":
      return <hr {...attributes} />;
    case "break":
      return (
        <span {...attributes}>
          {children}
          <br />
        </span>
      );
    default:
      next();
  }
}
