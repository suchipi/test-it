const path = require("path");
const runZayith = require("../run-zayith");

test("regenerator-runtime", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "regenerator-runtime/index.zayith.js
      [32m✓ defines regeneratorRuntime[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
