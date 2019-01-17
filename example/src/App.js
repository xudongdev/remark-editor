import React, { createRef, Component } from "react";
import remark from "remark";
import remarkHtml from "remark-html";
import { Editor, Prism } from "remark-editor";

import "primer-markdown/build/build.css";
import "prismjs/themes/prism.css";

const settings = { commonmark: true };
const markProcessor = remark().data("settings", settings);
const htmlProcessor = remark()
  .data("settings", settings)
  .use(remarkHtml);

class App extends Component {
  constructor(props) {
    super(props);

    this.previewRef = createRef();
    this.state = { value: null, markdown: "", html: "" };
  }

  async componentDidMount() {
    const markdown =
      localStorage.getItem("markdown") ||
      (await (await fetch(
        "https://raw.githubusercontent.com/xudongcc/remark-editor/master/README.md"
      )).text());

    const value = markProcessor.parse(markdown);
    const html = htmlProcessor.stringify(value);

    this.setState({ value, markdown, html }, () => {
      localStorage.setItem("markdown", markdown);
      Prism.highlightAllUnder(this.previewRef.current);
    });
  }

  handleChange = value => {
    const markdown = markProcessor.stringify(value);
    const html = htmlProcessor.stringify(value);

    this.setState({ value, markdown, html }, () => {
      localStorage.setItem("markdown", markdown);
      Prism.highlightAllUnder(this.previewRef.current);
    });
  };

  render() {
    return (
      <div className="app">
        {this.state.value && (
          <Editor
            className="editor markdown-body"
            value={this.state.value}
            onChange={this.handleChange}
          />
        )}
        <textarea className="markdown" value={this.state.markdown} readOnly />
        <div
          ref={this.previewRef}
          className="preview markdown-body"
          dangerouslySetInnerHTML={{ __html: this.state.html }}
        />
      </div>
    );
  }
}

export default App;
