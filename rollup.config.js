import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    external: [
      "is-hotkey",
      "prismjs",
      "prismjs/components",
      "react",
      "slate",
      "slate-react"
    ],
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true }
    ],
    plugins: [babel(), resolve(), commonjs()]
  }
];
