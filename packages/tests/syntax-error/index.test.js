const path = require("path");
const runTestIt = require("../run-test-it");

test("syntax error", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "syntax-error/index.test-it.js
      [31m✕ error in describe or before/after callback[39m

    [38;2;241;76;76m[1m● syntax-error/index.test-it.js[22m[39m

      SyntaxError: /Users/lily/Code/test-it/packages/tests/syntax-error/index.test-it.js: Unexpected token, expected \\";\\" (1:7)

      [0m[31m[1m>[22m[39m[90m 1 | [39msyntax error [36min[39m file[0m
      [0m [90m   | [39m       [31m[1m^[22m[39m[0m
      [0m [90m 2 | [39m[0m

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
