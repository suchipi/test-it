const path = require("path");
const runTestIt = require("../run-test-it");

test("dom", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "dom/index.test-it.js
      dom
        [32m✓ can access a real DOM (Chromium)[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
