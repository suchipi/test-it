const path = require("path");
const { spawn } = require("first-base");

const zayith = (...args) =>
  spawn("../../node_modules/.bin/zayith", ["--seed", "1234", ...args]);

test("dom", async () => {
  const run = zayith(path.join(__dirname, "*.zayith.js"));
  await run.completion;
  expect(run.result.error).toBe(false);

  const lines = run.result.stdout.split("\n");
  const indexOfLineWithRunTimeInIt = lines.length - 3;
  lines[indexOfLineWithRunTimeInIt] = lines[indexOfLineWithRunTimeInIt].replace(
    /in [\d.]+ sec/,
    "in X sec"
  );

  expect(lines.join("\n")).toMatchInlineSnapshot(`
    "Jasmine started

      dom/index.zayith.js

        dom
          [32m✓ can access a real DOM (Chromium)[39m

    Executed 1 of 1 spec[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(run.result.stderr).toBe("");

  expect(run.result.code).toBe(0);
});
