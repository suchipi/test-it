const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

module.exports = (filename) => {
  if (filename.endsWith(".json")) {
    return "module.exports = " + fs.readFileSync(filename);
  }

  const config = {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-transform-modules-commonjs",
    ],
  };

  if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
    config.presets.push("@babel/preset-typescript");
  } else {
    config.plugins.push("@babel/plugin-transform-flow-strip-types");
  }

  const result = babel.transformFileSync(filename, config);
  return result.code;
};
