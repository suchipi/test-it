const path = require("path");
const runTestIt = require("../run-test-it");

test("extensions", async () => {
  const result = await runTestIt([
    "--resolver",
    path.join(__dirname, "resolver.js"),
    path.join(__dirname, "*.test-it.js"),
  ]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ resolver/index.test-it.js loads the file[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
