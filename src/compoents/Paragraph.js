import React from "react";

export default class Paragraph extends React.Component {
  render() {
    const { attributes, children, parent } = this.props;

    if (parent.nodes.size <= 1) {
      return <div {...attributes}>{children}</div>;
    }

    return <p {...attributes}>{children}</p>;
  }
}
