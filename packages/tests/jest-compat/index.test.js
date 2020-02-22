const path = require("path");
const runZayith = require("../run-zayith");

test("basic", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "jest-compat/index.zayith.js
      [32m✓ test.only[39m
      [32m✓ it.only[39m
      describe
        [32m✓ test[39m
      describe
        [33m○ test[39m
      [33m○ it[39m
      describe
        [33m○ test[39m
      [33m○ test.skip[39m
      [33m○ it.skip[39m
      [33m○ test[39m

    [1m[1m[38;2;245;245;67m1 skipped[39m[22m[1m, [1m[38;2;35;209;139m3 passed[39m[22m[1m, 4 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
