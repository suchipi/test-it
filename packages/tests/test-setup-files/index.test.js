const path = require("path");
const runTestIt = require("../run-test-it");

test("global", async () => {
  const result = await runTestIt(
    [
      path.join(__dirname, "*.test-it.js"),
      "--test-setup-files",
      path.join(__dirname, "setup.js"),
    ],
    {
      cwd: __dirname,
    }
  );

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ index.test-it.js runs after the test setup file[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
