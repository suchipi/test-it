const path = require("path");
const { spawn } = require("first-base");

const zayith = (...args) =>
  spawn("../../node_modules/.bin/zayith", ["--seed", "1234", ...args]);

test("syntax error", async () => {
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

      syntax error/index.zayith.js
        [31m✗ syntax error/index.zayith.js[39m
          [31m- [39m[31mSyntaxError: Unexpected identifier[39m

    **************************************************
    *                     Errors                     *
    **************************************************

    1) syntax error/index.zayith.js
      [31m- [39m[31mSyntaxError: Unexpected identifier[39m

    Executed 0 of 0 specs[31m (1 ERROR)[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(run.result.stderr).toBe("");

  expect(run.result.code).toBe(1);
});
