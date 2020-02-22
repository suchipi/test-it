const path = require("path");
const { spawn } = require("first-base");

const zayith = (...args) =>
  spawn("node", ["../../packages/cli/dist/cli.js", "--seed", "1234", ...args]);

test("node", async () => {
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

      node
        [32m✓ can \`require\` using a relative path[39m
        [32m✓ can \`require\` builtins[39m

    Executed 2 of 2 specs[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(run.result.stderr).toBe("");

  expect(run.result.code).toBe(0);
});
