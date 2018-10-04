import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: pkg.browser,
        format: "umd"
      },
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      babel({
        exclude: ["node_modules/**"]
      })
    ]
  }
];
