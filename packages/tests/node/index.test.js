const path = require("path");
const runZayith = require("../run-zayith");

test("node", async () => {
  const result = await runZayith(path.join(__dirname, "*.zayith.js"));

  expect(result.stdout).toMatchInlineSnapshot(`
    "Jasmine started

      node/index.zayith.js

        node
          [32m✓ can \`require\` using a relative path[39m
          [32m✓ can \`require\` builtins[39m

    Executed 2 of 2 specs[32m SUCCESS[39m in X sec.
    Randomized with seed 1234.
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
