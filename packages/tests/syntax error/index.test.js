const path = require("path");
const runZayith = require("../run-zayith");

test("syntax error", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      syntax error/index.zayith.js
        [31m✗ syntax error/index.zayith.js[39m
          [31m- [39m[31mSyntaxError: Unexpected identifier[39m

    **************************************************
    *                     Errors                     *
    **************************************************

    1) syntax error/index.zayith.js
      [31m- [39m[31mSyntaxError: Unexpected identifier[39m

    Executed 0 of 0 specs[31m (1 ERROR)[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
