const path = require("path");
const runZayith = require("../run-zayith");

test("node", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "node/index.zayith.js
      node
        [32m✓ can \`require\` using a relative path[39m
        [32m✓ can \`require\` builtins[39m

    [1m[1m[38;2;35;209;139m2 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
