const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

module.exports = (filename) => {
  if (filename.endsWith(".json")) {
    return "module.exports = " + fs.readFileSync(filename);
  }

  let config;
  const maybeConfigPath = path.join(process.cwd(), "babel.config.js");
  if (fs.existsSync(maybeConfigPath)) {
    config = require(maybeConfigPath);
  } else {
    config = {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining",
      ],
    };

    if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
      config.presets.push("@babel/preset-typescript");
    } else {
      config.plugins.push("@babel/plugin-transform-flow-strip-types");
    }
  }

  // Always add the plugin that compiles ESM to commonjs,
  // because we *have* to use commonjs in test-it, but people
  // might be outputting ESM eg. for webpack to consume
  config = {
    ...config,
    plugins: [...config.plugins, "@babel/plugin-transform-modules-commonjs"],
  };

  const result = babel.transformFileSync(filename, config);
  return result.code;
};
