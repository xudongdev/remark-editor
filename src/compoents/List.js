import React from "react";

export default class List extends React.Component {
  render() {
    const { attributes, node, children } = this.props;
    if (node.data.get("ordered")) {
      return <ol {...attributes}>{children}</ol>;
    } else {
      return <ul {...attributes}>{children}</ul>;
    }
  }
}
