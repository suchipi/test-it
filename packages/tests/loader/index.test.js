const path = require("path");
const { spawn } = require("first-base");

const zayith = (...args) =>
  spawn("../../node_modules/.bin/zayith", ["--seed", "1234", ...args]);

test("loader", async () => {
  const run = zayith(
    "--loader",
    path.join(__dirname, "loader.js"),
    path.join(__dirname, "*.zayith.js")
  );
  await run.completion;
  expect(run.result.error).toBe(false);

  const lines = run.result.stdout.split("\n");
  const indexOfLineWithRunTimeInIt = lines.length - 3;
  lines[indexOfLineWithRunTimeInIt] = lines[indexOfLineWithRunTimeInIt].replace(
    /in [\d.]+ sec/,
    "in X sec"
  );

  const rootDir = path.join(__dirname, "..", "..", "..");

  const linesWithoutRootDir = lines.map((line) => {
    return line.replace(new RegExp(rootDir, "g"), "<root>");
  });

  expect(linesWithoutRootDir.join("\n")).toMatchInlineSnapshot(`
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
  expect(run.result.stderr).toBe("");

  expect(run.result.code).toBe(0);
});
