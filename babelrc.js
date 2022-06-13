// 这里通过cross-env注入不同执行变量来确定babel转码成不同的格式es和commonjs
const { NODE_ENV, BABEL_ENV } = process.env;
const cjs = NODE_ENV === "test" || BABEL_ENV === "commonjs";
const loose = true;

module.exports = {
  // 设置modules:false来避免babel转换成commonjs之后rollup执行会报错
  presets: [["@babel/env", { loose, modules: false }]],
  plugins: [
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-object-rest-spread", { loose }],
    // 对jsx语法进行转换
    "@babel/transform-react-jsx",
    cjs && ["@babel/transform-modules-commonjs", { loose }],
    [
      "@babel/transform-runtime",
      {
        useESModules: !cjs,
        version: require("./package.json").dependencies["@babel/runtime"].replace(/^[^0-9]*/, "")
      }
    ],
    ["@babel/plugin-proposal-class-properties"]
  ].filter(Boolean)
};
