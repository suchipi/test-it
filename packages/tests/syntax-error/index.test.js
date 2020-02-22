const path = require("path");
const runZayith = require("../run-zayith");

test("syntax error", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "syntax-error/index.zayith.js
      [31m✕ error in describe or before/after callback[39m

    [38;2;241;76;76m[1m● syntax-error/index.zayith.js[22m[39m

      SyntaxError: /Users/lily/Code/zayith/packages/tests/syntax-error/index.zayith.js: Unexpected token, expected \\";\\" (1:7)
      
      [0m[31m[1m>[22m[39m[90m 1 | [39msyntax error [36min[39m file[0m
      [0m [90m   | [39m       [31m[1m^[22m[39m[0m
      [0m [90m 2 | [39m[0m

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
