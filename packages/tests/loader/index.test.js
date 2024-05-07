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

  expect(result.stdout).toMatchInlineSnapshot(`
    "LOADER: <rootDir>/packages/tests/loader/index.test-it.js
    LOADER: <rootDir>/node_modules/@swc/helpers/cjs/_interop_require_default.cjs
    LOADER: <rootDir>/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs
    LOADER: <rootDir>/node_modules/react/index.js
    LOADER: <rootDir>/node_modules/react/cjs/react.development.js
    LOADER: <rootDir>/packages/tests/loader/App.jsx
    [32m✓ loader/index.test-it.js basic JSX works[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
