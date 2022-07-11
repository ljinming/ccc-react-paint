const { override, addLessLoader, addWebpackAlias } = require("customize-cra");
const path = require("path");

// eslint-disable-next-line no-undef
module.exports = override(
  addWebpackAlias({
    ["@/src"]: path.resolve(__dirname, "src"),
    ["@/public"]: path.resolve(__dirname, "public"),
    ["@/components"]: path.resolve(__dirname, "src/components"),
    ["@/util"]: path.resolve(__dirname, "src/pages/util"),
    ["@/context"]: path.resolve(__dirname, "src/context"),
    ["@/assets"]: path.resolve(__dirname, "src/assets"),
    ["@/icon"]: path.resolve(__dirname, "src/assets/icon"),
    ["@/tool"]: path.resolve(__dirname, "src/tool"),
    ["@/pages"]: path.resolve(__dirname, "src/pages"),

  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true
    }
  })
);
