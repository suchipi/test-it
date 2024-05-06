const path = require("path");
const resolve = require("resolve");
const { Module } = require("module");

const allBuiltins = new Set(Module.builtinModules);

exports.interfaceVersion = 2;

exports.resolve = (id, fromFilePath, _settings) => {
  if (allBuiltins.has(id)) {
    return "external:" + id;
  }

  return resolve.sync(id, {
    basedir: path.dirname(fromFilePath),
    preserveSymlinks: false,
    extensions: [
      ".js",
      ".json",
      ".mjs",
      ".jsx",
      ".ts",
      ".tsx",
      ".node",
      ".txt",
    ],
  });
};
