const path = require("path");
const runZayith = require("../run-zayith");

test("nw", async () => {
  const result = await runZayith([path.join(__dirname, "*.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      nw/index.zayith.js

        nw
          [32m✓ can access NW.js APIs[39m

    Executed 1 of 1 spec[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
