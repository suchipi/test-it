const path = require("path");
const runZayith = require("../run-zayith");

test("syntax error", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "syntax error/index.zayith.js
      [31m✕ error in describe or before/after callback[39m

    [38;2;241;76;76m[1m● syntax error/index.zayith.js[22m[39m

      SyntaxError: Unexpected identifier
          at <Jasmine>

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
