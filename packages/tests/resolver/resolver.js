const path = require("path");
const builtinModules = require("builtin-modules");
const resolve = require("resolve");

const allBuiltins = new Set(builtinModules);

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
