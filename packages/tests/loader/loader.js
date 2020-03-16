const fs = require("fs");
const babel = require("@babel/core");
const defaultLoader = require("@test-it/default-loader");

module.exports = (filepath) => {
  console.log("LOADER:", filepath);

  return defaultLoader(filepath);
};
