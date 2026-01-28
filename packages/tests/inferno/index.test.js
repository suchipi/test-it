const path = require("path");
const runTestIt = require("../run-test-it");

test("inferno", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ inferno/index.test-it.js inferno-compat works[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toMatchInlineSnapshot(`
    "console.warn (inferno/index.test-it.js): You are running production build of Inferno in development mode. Use dev:module entry point.
    "
  `);
  expect(result.code).toBe(0);
});
