// Rollup plugins
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from "rollup-plugin-babel";
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from "rollup-plugin-node-resolve";
// 解决rollup.js无法识别CommonJS模块
import commonjs from "rollup-plugin-commonjs";
// 全局替换变量比如process.env
import replace from "rollup-plugin-replace";
// 使rollup可以使用postCss处理样式文件less、css等
import postcss from "rollup-plugin-postcss";
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
import image from "@rollup/plugin-image";
// 压缩打包代码（这里弃用因为该插件不能识别es的语法，所以采用terser替代）
// import { uglify } from 'rollup-plugin-uglify';
// 压缩打包代码
import { terser } from "rollup-plugin-terser";
// import less from 'rollup-plugin-less';
// PostCSS plugins
// 处理css定义的变量
import simplevars from "postcss-simple-vars";
// 处理less嵌套样式写法
import nested from "postcss-nested";
// 可以提前适用最新css特性（已废弃由postcss-preset-env替代，但还是引用进来了。。。）
// import cssnext from 'postcss-cssnext';
// 替代cssnext
import postcssPresetEnv from "postcss-preset-env";
// css代码压缩
import cssnano from "cssnano";
import alias from "@rollup/plugin-alias";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-typescript2";
import path from "path";

const env = process.env.NODE_ENV;

export default {
  input: "src/entry.ts",
  // 输出文件夹，可以是个数组输出不同格式（umd,cjs,es...）通过env是否是生产环境打包来决定文件命名是否是.min
  output: [
    {
      file: `dist/ccc-paint-umd${env === "production" ? ".min" : ""}.js`,
      format: "umd",
      name: "geneUI"
    },
    {
      file: `dist/ccc-paint-es${env === "production" ? ".min" : ""}.js`,
      format: "es"
    }
  ],
  // 注入全局变量比如jQuery的$这里只是尝试 并未启用
  // globals: {
  //   react: 'React',                                         // 这跟external 是配套使用的，指明global.React即是外部依赖react
  //   antd: 'antd'
  // },
  // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
  onwarn: function (warning) {
    if (warning.code === "THIS_IS_UNDEFINED") {
      return;
    }
  },
  // 将模块视为外部模块，不会打包在库中
  external: ["react", "react-is", "antd", "@ant-design/icons", "prop-types", "react/jsx-runtime", "material-ui-color"], // 插件
  // 插件
  plugins: [
    image(),
    postcss({
      plugins: [
        simplevars(),
        nested(),
        // cssnext({ warnForDuplicates: false, }),
        postcssPresetEnv(),
        cssnano()
      ],
      // 处理.css和.less文件
      extensions: [".css", "less"]
    }),
    resolve(),
    // babel处理不包含node_modules文件的所有js
    babel({
      exclude: "**/node_modules/**",
      runtimeHelpers: true,
      plugins: ["@babel/plugin-external-helpers"]
    }),
    commonjs(),
    nodeResolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"]
    }),
    ts({
      tsconfig: path.resolve(__dirname, "tsconfig.json")
    }),
    alias({
      entries: {
        "@/src": ["src/*"],
        "@/components": ["src/components"],
        "@/util": ["src/util"],
        "@/context": ["src/context"],
        "@/assets": ["src/assets"],
        "@/icon": ["src/assets/icon"]
      }
    }),
    // 全局替换NODE_ENV，exclude表示不包含某些文件夹下的文件
    replace({
      // exclude: 'node_modules/**',
      "process.env.NODE_ENV": JSON.stringify(env || "development")
    }),
    // 生产环境执行terser压缩代码
    env === "production" && terser()
  ]
};
