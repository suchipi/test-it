const path = require("path");
const runTestIt = require("../run-test-it");

test("basic", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ jest-compat/index.test-it.js test.only[39m
    [32m✓ jest-compat/index.test-it.js it.only[39m
    [32m✓ jest-compat/index.test-it.js describe test[39m
    [33m○ jest-compat/index.test-it.js describe test[39m
    [33m○ jest-compat/index.test-it.js it[39m
    [33m○ jest-compat/index.test-it.js describe test[39m
    [33m○ jest-compat/index.test-it.js test.skip[39m
    [33m○ jest-compat/index.test-it.js it.skip[39m
    [33m○ jest-compat/index.test-it.js test[39m

    [1m[1m[38;2;245;245;67m1 skipped[39m[22m[1m, [1m[38;2;35;209;139m3 passed[39m[22m[1m, 4 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
