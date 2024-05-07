const path = require("path");
const runTestIt = require("../run-test-it");

test("basic", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[31m✕ basic/index.test-it.js basic failing test[39m
    [33m○ basic/index.test-it.js basic pending test[39m
    [32m✓ basic/index.test-it.js basic succeeding test[39m

    [38;2;241;76;76m[1m● basic/index.test-it.js basic failing test[22m[39m

      [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m
      
      
      Expected: [32m5[39m
      Received: [31m4[39m
      error properties: Object({ matcherResult: Object({ actual: 4, expected: 5, message: '[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m
      
      Expected: [32m5[39m
      Received: [31m4[39m', name: 'toBe', pass: false }) })
          at <Jasmine>
          at process.processImmediate ([34mnode:internal/timers:478:21[39m)

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, [1m[38;2;245;245;67m1 skipped[39m[22m[1m, [1m[38;2;35;209;139m1 passed[39m[22m[1m, 3 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
