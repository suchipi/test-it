const path = require("path");
const { spawn } = require("first-base");

const zayith = (...args) =>
  spawn("node", ["../../packages/cli/dist/cli.js", "--seed", "1234", ...args]);

test("basic", async () => {
  const run = zayith(path.join(__dirname, "fixture.js"));
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

      basic
        [31m✗ failing test[39m
          [31m- [39m[31mError: [2mexpect([22m[31mreceived[31m[2m).[22mtoBe[2m([22m[32mexpected[31m[2m) // Object.is equality[22m

          Expected: [32m5[31m
          Received: [31m4[31m[39m
        [32m✓ succeeding test[39m

    **************************************************
    *                    Failures                    *
    **************************************************

    1) basic failing test
      [31m- [39m[31mError: [2mexpect([22m[31mreceived[31m[2m).[22mtoBe[2m([22m[32mexpected[31m[2m) // Object.is equality[22m

      Expected: [32m5[31m
      Received: [31m4[31m[39m

    **************************************************
    *                    Pending                     *
    **************************************************

    1) basic pending test
      [33mTemporarily disabled with xit[39m

    Executed 2 of 3 specs[31m (1 FAILED)[39m[33m (1 PENDING)[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(run.result.stderr).toBe("");

  expect(run.result.code).toBe(1);
});
