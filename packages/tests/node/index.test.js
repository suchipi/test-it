const path = require("path");
const runTestIt = require("../run-test-it");

test("node", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ node/index.test-it.js node can \`require\` using a relative path[39m
    [32m✓ node/index.test-it.js node can \`require\` builtins[39m

    [1m[1m[38;2;35;209;139m2 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
