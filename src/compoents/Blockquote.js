import React from "react";

export default class Blockquote extends React.Component {
  render() {
    const { attributes, children } = this.props;
    return <blockquote {...attributes}>{children}</blockquote>;
  }
}
