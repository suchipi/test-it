const path = require("path");
const runTestIt = require("../run-test-it");

test("loader", async () => {
  const result = await runTestIt(
    [
      "--loader",
      path.join(__dirname, "loader.js"),
      path.join(__dirname, "*.test-it.js"),
    ],
    {
      env: Object.assign({}, process.env, { NODE_ENV: "development" }),
    }
  );

  const rootDir = path.join(__dirname, "..", "..", "..");
  const stdoutWithoutRootDir = result.stdout
    .split("\n")
    .map((line) => {
      return line.replace(new RegExp(rootDir, "g"), "<root>");
    })
    .join("\n");

  expect(stdoutWithoutRootDir).toMatchInlineSnapshot(`
    "LOADER: <root>/packages/tests/loader/index.test-it.js
    LOADER: <root>/node_modules/react/index.js
    LOADER: <root>/node_modules/react/cjs/react.development.js
    LOADER: <root>/node_modules/object-assign/index.js
    LOADER: <root>/node_modules/prop-types/checkPropTypes.js
    LOADER: <root>/node_modules/prop-types/lib/ReactPropTypesSecret.js
    LOADER: <root>/packages/tests/loader/App.jsx
    [32m✓ loader/index.test-it.js basic JSX works[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
