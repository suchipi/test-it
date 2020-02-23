const path = require("path");
const runTestIt = require("../run-test-it");

test("isolation", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "isolation/first.test-it.js
      first
        [32m✓ is isolated from other tests[39m
    isolation/second.test-it.js
      second
        [32m✓ is isolated from other tests[39m

    [1m[1m[38;2;35;209;139m2 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
