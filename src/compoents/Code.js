import React from "react";
import styled from "styled-components";
import config from "../config";

const LanguageSelect = styled.select`
  transition: 0.3s;
  opacity: 0.4;

  &:hover {
    opacity: 1;
  }
`;

export default class Code extends React.Component {
  handleChange = event => {
    const { editor, node } = this.props;

    editor.setNodeByKey(node.key, {
      data: {
        ...node.data.toJSON(),
        lang: event.target.value
      }
    });
  };

  render() {
    const { node, attributes, children } = this.props;
    const lang = node.data.get("lang");
    const className = `language-${lang}`;

    return (
      <div style={{ position: "relative" }}>
        <pre className={className}>
          <code {...attributes} className={className}>
            {children}
          </code>
        </pre>
        <div
          contentEditable={false}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            lineHeight: "1em"
          }}
        >
          <LanguageSelect value={lang} onChange={this.handleChange}>
            {config.prism.languages.map(language => (
              <option key={language.value} value={language.value}>
                {language.title}
              </option>
            ))}
          </LanguageSelect>
        </div>
      </div>
    );
  }
}
