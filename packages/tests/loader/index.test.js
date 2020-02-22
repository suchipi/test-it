const path = require("path");
const runZayith = require("../run-zayith");

test("loader", async () => {
  const result = await runZayith(
    "--loader",
    path.join(__dirname, "loader.js"),
    path.join(__dirname, "*.zayith.js")
  );

  const rootDir = path.join(__dirname, "..", "..", "..");
  const stdoutWithoutRootDir = result.stdout
    .split("\n")
    .map((line) => {
      return line.replace(new RegExp(rootDir, "g"), "<root>");
    })
    .join("\n");

  expect(stdoutWithoutRootDir).toMatchInlineSnapshot(`
    "LOADER: <root>/packages/tests/loader/index.zayith.js
    LOADER: <root>/node_modules/@babel/runtime/helpers/interopRequireWildcard.js
    LOADER: <root>/node_modules/@babel/runtime/helpers/typeof.js
    LOADER: <root>/node_modules/@babel/runtime/helpers/interopRequireDefault.js
    LOADER: <root>/node_modules/react/index.js
    LOADER: <root>/node_modules/react/cjs/react.development.js
    LOADER: <root>/node_modules/object-assign/index.js
    LOADER: <root>/node_modules/prop-types/checkPropTypes.js
    LOADER: <root>/node_modules/prop-types/lib/ReactPropTypesSecret.js
    LOADER: <root>/packages/tests/loader/App.jsx
    Jasmine started

      loader/index.zayith.js

        basic
          [32m✓ JSX works[39m

    Executed 1 of 1 spec[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
