const path = require("path");
const runTestIt = require("../run-test-it");

test("regenerator-runtime", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "regenerator-runtime/index.test-it.js
      [32m✓ defines regeneratorRuntime[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
