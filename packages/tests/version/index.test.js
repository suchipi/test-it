const path = require("path");
const runZayith = require("../run-zayith");

test("version", async () => {
  const result = await runZayith(["--version"]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "@zayith/cli: 0.3.0
    @zayith/core: 0.3.0
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
