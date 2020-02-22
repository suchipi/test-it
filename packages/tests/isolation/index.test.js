const path = require("path");
const runZayith = require("../run-zayith");

test("isolation", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "isolation/first.zayith.js
      first
        [32m✓ is isolated from other tests[39m
    isolation/second.zayith.js
      second
        [32m✓ is isolated from other tests[39m

    [1m[1m[38;2;35;209;139m2 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
