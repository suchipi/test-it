const path = require("path");
const runZayith = require("../run-zayith");

test("dom", async () => {
  const result = await runZayith(path.join(__dirname, "*.zayith.js"));

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      dom/index.zayith.js

        dom
          [32m✓ can access a real DOM (Chromium)[39m

    Executed 1 of 1 spec[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
