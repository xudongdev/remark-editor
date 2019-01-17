import Prism from "prismjs";
import { languages } from "prismjs/components";
import sortBy from "lodash/sortBy";

document.removeEventListener("DOMContentLoaded", Prism.highlightAll);

// https://github.com/PrismJS/prism/issues/1423
require(`prismjs/components/prism-markup-templating`);

export default {
  languages: sortBy(
    [
      {
        value: "",
        title: "Plain Text"
      },
      {
        value: "html",
        title: "HTML"
      },
      {
        value: "xml",
        title: "XML"
      },
      {
        value: "svg",
        title: "SVG"
      },
      {
        value: "mathml",
        title: "MathML"
      },
      ...[
        "aspnet",
        "bash",
        "c",
        "csharp",
        "cpp",
        "css",
        "coffeescript",
        "d",
        "dart",
        "diff",
        "elixir",
        "erlang",
        "fsharp",
        "go",
        "graphql",
        "groovy",
        "http",
        "haskell",
        "java",
        "javascript",
        "julia",
        "kotlin",
        "lua",
        "ocaml",
        "objectivec",
        "php",
        "perl",
        "python",
        "r",
        "jsx",
        "tsx",
        "ruby",
        "rust",
        "sql",
        "scala",
        "scheme",
        "swift",
        "typescript",
        "markup",
        "yaml"
      ].map(value => {
        require(`prismjs/components/prism-${value}`);
        return {
          value,
          title: languages[value] ? languages[value].title : value
        };
      })
    ],
    "title"
  )
};
