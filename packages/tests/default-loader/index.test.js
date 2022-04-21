const path = require("path");
const runTestIt = require("../run-test-it");

test("basic", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ default-loader/index.test-it.js can load ts[39m
    console.log (default-loader/index.test-it.js): async function hi() {
      await new Promise(resolve => setTimeout(resolve, 10));
      console.log(hi.toString());
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    [32m✓ default-loader/index.test-it.js doesn't compile async syntax[39m
    [32m✓ default-loader/index.test-it.js can load tsx[39m
    [32m✓ default-loader/index.test-it.js can load flow[39m

    [1m[1m[38;2;35;209;139m4 passed[39m[22m[1m, 4 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});
