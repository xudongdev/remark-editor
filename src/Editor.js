import React, { Component } from "react";
import { Editor as SlateEditor } from "slate-react";
import plugins from "./plugins";
import renderNode from "./renderNode";
import schema from "./schema";

import mdastToValue from "./utils/mdastToValue";
import valueToMdast from "./utils/valueToMdast";

export class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: mdastToValue(props.value)
    };
  }

  handleChange({ value }) {
    this.setState({ value }, () => {
      if (this.props.onChange) {
        this.props.onChange(valueToMdast(value));
      }
    });
  }

  render() {
    return (
      <SlateEditor
        {...this.props}
        plugins={plugins}
        renderNode={renderNode}
        schema={schema}
        value={this.state.value}
        onChange={change => this.handleChange(change)}
      />
    );
  }
}
