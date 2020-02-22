const fs = require("fs");
const babel = require("@babel/core");

module.exports = (filepath) => {
  console.log("LOADER:", filepath);

  if (filepath.match(/node_modules/)) {
    return fs.readFileSync(filepath, "utf-8");
  } else {
    const result = babel.transformFileSync(filepath, {
      presets: ["react-app"],
    });

    return result.code;
  }
};
