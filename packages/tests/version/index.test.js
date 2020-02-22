const path = require("path");
const runZayith = require("../run-zayith");

test("version", async () => {
  const result = await runZayith(["--version"], { skipSanitization: true });

  expect(result.stdout).toMatchInlineSnapshot(`
    "@zayith/cli: 0.2.0
    @zayith/core: 0.2.2
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
