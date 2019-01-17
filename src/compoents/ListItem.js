import React from "react";

export default class ListItem extends React.Component {
  render() {
    const { attributes, children } = this.props;
    return <li {...attributes}>{children}</li>;
  }
}
