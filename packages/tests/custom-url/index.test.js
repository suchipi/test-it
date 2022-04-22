const path = require("path");
const runTestIt = require("../run-test-it");

test("basic", async () => {
  const result = await runTestIt(
    ["--url", "http://example.com", "*.test-it.js"],
    { cwd: __dirname }
  );

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ index.test-it.js looks right[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
