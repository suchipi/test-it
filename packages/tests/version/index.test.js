const path = require("path");
const runTestIt = require("../run-test-it");

test("version", async () => {
  const result = await runTestIt(["--version"]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "@test-it/cli: 0.8.0
    @test-it/core: 0.8.0
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
