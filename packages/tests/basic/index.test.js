const path = require("path");
const runZayith = require("../run-zayith");

test("basic", async () => {
  const result = await runZayith(path.join(__dirname, "*.zayith.js"));

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      basic/index.zayith.js

        basic
          [31m✗ failing test[39m
            [31m- [39m[31mError: [2mexpect([22m[31mreceived[31m[2m).[22mtoBe[2m([22m[32mexpected[31m[2m) // Object.is equality[22m

            Expected: [32m5[31m
            Received: [31m4[31m[39m
          [32m✓ succeeding test[39m

    **************************************************
    *                    Failures                    *
    **************************************************

    1) basic/index.zayith.js basic failing test
      [31m- [39m[31mError: [2mexpect([22m[31mreceived[31m[2m).[22mtoBe[2m([22m[32mexpected[31m[2m) // Object.is equality[22m

      Expected: [32m5[31m
      Received: [31m4[31m[39m

    **************************************************
    *                    Pending                     *
    **************************************************

    1) basic/index.zayith.js basic pending test
      [33mTemporarily disabled with xit[39m

    Executed 2 of 3 specs[31m (1 FAILED)[39m[33m (1 PENDING)[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
