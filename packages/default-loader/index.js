const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");
const mime = require("mime-types");
const kameDefaultLoader = require("kame/dist/default-loader").default;

module.exports = function defaultLoader(filename) {
  const extension = path.extname(filename);

  switch (extension) {
    // Override kame's default loader for js files,
    // because the default loader uses all babel transforms, and
    // we only want the ones necessary for the current node version
    // (which is node-nw).
    case ".js":
    case ".jsx":
    case ".mjs":
    case ".ts":
    case ".tsx": {
      if (filename.match(/node_modules/)) {
        return fs.readFileSync(filename, "utf-8");
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

      if (extension === ".ts" || extension === ".tsx") {
        config.presets.push("@babel/preset-typescript");
      } else {
        config.plugins.push("@babel/plugin-transform-flow-strip-types");
      }

      const result = babel.transformFileSync(filename, config);
      return result.code;
    }

    // But defer to kame for all other filetypes.
    default: {
      return kameDefaultLoader(filename);
    }
  }
};
