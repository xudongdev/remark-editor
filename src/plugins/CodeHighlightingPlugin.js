import React from "react";
import Prism from "prismjs";

function createDecoration({ text, textStart, textEnd, start, end, className }) {
  if (start >= textEnd || end <= textStart) {
    // Ignore, the token is not in the text
    return null;
  }

  // Shrink to this text boundaries
  start = Math.max(start, textStart);
  end = Math.min(end, textEnd);

  // Now shift offsets to be relative to this text
  start -= textStart;
  end -= textStart;

  return {
    anchor: {
      key: text.key,
      offset: start
    },
    focus: {
      key: text.key,
      offset: end
    },
    mark: { type: "prism-token", data: { className } }
  };
}

export default function() {
  return {
    onKeyDown(event, editor, next) {
      const { value } = editor;
      const { startBlock } = value;

      if (event.key === "Enter" && startBlock.type === "code") {
        event.preventDefault();
        editor.insertText("\n");
        return;
      }

      next();
    },
    renderMark(props) {
      const { mark, children } = props;
      if (mark.type === "prism-token") {
        const className = mark.data.get("className");
        return <span className={className}>{children}</span>;
      }
    },
    decorateNode(node, editor, next) {
      if (node.type !== "code") return next();

      const lang = node.data.get("lang");
      const grammar = Prism.languages[lang];
      if (!grammar) return next();

      // Tokenize the whole block text
      const texts = node.getTexts().toArray();
      const string = texts.map(t => t.text).join("\n");
      const tokens = Prism.tokenize(string, grammar);

      // The list of decorations to return
      const decorations = [];
      let textStart = 0;
      let textEnd = 0;

      texts.forEach(text => {
        textEnd = textStart + text.text.length;

        let offset = 0;

        function processToken(token, accu) {
          accu = accu || "";

          if (typeof token === "string") {
            if (accu) {
              const decoration = createDecoration({
                text,
                textStart,
                textEnd,
                start: offset,
                end: offset + token.length,
                className: `prism-token token ${accu}`
              });
              if (decoration) {
                decorations.push(decoration);
              }
            }
            offset += token.length;
          } else {
            accu = `${accu} ${token.type} ${token.alias || ""}`;

            if (typeof token.content === "string") {
              const decoration = createDecoration({
                text,
                textStart,
                textEnd,
                start: offset,
                end: offset + token.content.length,
                className: `prism-token token ${accu}`
              });
              if (decoration) {
                decorations.push(decoration);
              }

              offset += token.content.length;
            } else {
              // When using token.content instead of token.matchedStr, token can be deep
              for (let i = 0; i < token.content.length; i += 1) {
                processToken(token.content[i], accu);
              }
            }
          }
        }

        tokens.forEach(processToken);
        textStart = textEnd + 1; // account for added `\n`
      });

      return decorations;
    }
  };
}
