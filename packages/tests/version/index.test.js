const path = require("path");
const runZayith = require("../run-zayith");

test("version", async () => {
  const result = await runZayith(["--version"], { skipSanitization: true });

  expect(result.stdout).toMatchInlineSnapshot(`
    "@zayith/cli: 0.1.1
    @zayith/core: 0.1.0
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});