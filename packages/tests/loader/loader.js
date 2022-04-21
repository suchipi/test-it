const defaultLoader = require("@test-it/default-loader");

exports.load = (filepath) => {
  console.log("LOADER:", filepath);

  return defaultLoader.load(filepath);
};
