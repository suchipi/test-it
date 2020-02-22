const path = require("path");
const runZayith = require("../run-zayith");

test("extensions", async () => {
  const result = await runZayith([
    "--resolve-extensions",
    "js,txt",
    path.join(__dirname, "*.zayith.js"),
  ]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      extensions/index.zayith.js
        [32m✓ loads the file[39m

    Executed 1 of 1 spec[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
