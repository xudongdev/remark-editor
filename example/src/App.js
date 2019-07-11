import React, { createRef, Component } from "react";
import styled from "styled-components";
import remark from "remark";
import remarkHtml from "remark-html";
import { Editor, Prism } from "remark-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

import "primer-markdown/build/build.css";
import "prismjs/themes/prism.css";

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  background-color: #404040;
  color: #fff;
`;

const ButtonGroup = styled.div`
  display: flex;
  height: 36px;
`;

const Button = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  border: 1px #fff solid;

  :not(:last-child) {
    border-right: none;
  }

  :first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  :last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const Main = styled.main`
  display: flex;
  flex: 1;

  > *:not(:last-child) {
    border-right: 1px solid #eaecef;
  }
`;

const settings = { commonmark: true };
const markProcessor = remark().data("settings", settings);
const htmlProcessor = remark()
  .data("settings", settings)
  .use(remarkHtml);

class App extends Component {
  constructor(props) {
    super(props);

    this.previewRef = createRef();
    this.state = {
      value: null,
      markdown: "",
      html: "",
      visible: { editor: true, preview: true, markdown: true }
    };
  }

  async componentDidMount() {
    const markdown =
      localStorage.getItem("markdown") ||
      (await (await fetch(
        "https://raw.githubusercontent.com/hxddev/remark-editor/master/README.md"
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
    const { value, markdown, html, visible } = this.state;

    return (
      <div className="app">
        <Header>
          <ButtonGroup>
            <Button
              onClick={() =>
                this.setState({
                  visible: { ...visible, editor: !visible.editor }
                })
              }
            >
              <FontAwesomeIcon
                icon={faEdit}
                style={{ opacity: visible.editor ? 1 : 0.5 }}
              />
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  visible: { ...visible, markdown: !visible.markdown }
                })
              }
            >
              <FontAwesomeIcon
                icon={faMarkdown}
                style={{ opacity: visible.markdown ? 1 : 0.5 }}
              />
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  visible: { ...visible, preview: !visible.preview }
                })
              }
            >
              <FontAwesomeIcon
                icon={faEye}
                style={{ opacity: visible.preview ? 1 : 0.5 }}
              />
            </Button>
          </ButtonGroup>
        </Header>
        <Main>
          {value && (
            <Editor
              style={visible.editor ? null : { display: "none" }}
              className="editor markdown-body"
              value={value}
              onChange={this.handleChange}
            />
          )}
          <textarea
            style={visible.markdown ? null : { display: "none" }}
            className="markdown"
            value={markdown}
            readOnly
          />
          <div
            style={visible.preview ? null : { display: "none" }}
            ref={this.previewRef}
            className="preview markdown-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Main>
      </div>
    );
  }
}

export default App;
