const path = require("path");
const runZayith = require("../run-zayith");

test("isolation", async () => {
  const result = await runZayith(path.join(__dirname, "*.zayith.js"));

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      isolation/first.zayith.js

        first
          [32m✓ is isolated from other tests[39m

      isolation/second.zayith.js

        second
          [32m✓ is isolated from other tests[39m

    Executed 2 of 2 specs[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
