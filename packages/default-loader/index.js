const kame = require("kame");

exports.load = (filename) => {
  return kame.defaultLoader.load(filename, { target: "es2019" });
};
