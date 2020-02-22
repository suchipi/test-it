const path = require("path");
const runZayith = require("../run-zayith");

test("basic", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "default-loader/index.zayith.js
      [32m✓ can load ts[39m
      [32m✓ can load tsx[39m
      [32m✓ can load flow[39m

    [1m[1m[38;2;35;209;139m3 passed[39m[22m[1m, 3 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
