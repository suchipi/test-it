const path = require("path");
const runTestIt = require("../run-test-it");

test("console-log", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "console.log (console-log/index.test-it.js): log
    console.info (console-log/index.test-it.js): info
    [32m✓ console-log/index.test-it.js console-log can print to the console[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toMatchInlineSnapshot(`
    "console.warn (console-log/index.test-it.js): warn
    console.error (console-log/index.test-it.js): error
    "
  `);
  expect(result.code).toBe(0);
});
