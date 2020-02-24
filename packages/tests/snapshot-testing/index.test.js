const path = require("path");
const shelljs = require("shelljs");
const runTestIt = require("../run-test-it");

test("snapshot-testing", async () => {
  shelljs.mv(
    path.join(__dirname, "index.test-it.js.snap.jest-no-touch-pls"),
    path.join(__dirname, "index.test-it.js.snap")
  );
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")], {
    cwd: __dirname,
  });
  shelljs.mv(
    path.join(__dirname, "index.test-it.js.snap"),
    path.join(__dirname, "index.test-it.js.snap.jest-no-touch-pls")
  );

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ index.test-it.js snapshot-testing second test[39m
    [31m✕ index.test-it.js snapshot-testing first test[39m

    [38;2;241;76;76m[1m● index.test-it.js snapshot-testing first test[22m[39m

      Error: [1m[31mexpected value to match snapshot snapshot-testing first test[39m[22m
      
      [32m- Snapshot[39m
      [31m+ Received[39m
      
      [2m  Object {[22m
      [32m-   \\"haha\\": \\"woop woop\\",[39m
      [31m+   \\"haha\\": \\"yolo\\",[39m
      [2m  }[22m
      error properties: Object({ matcherResult: Object({ message: Function, pass: false }) })
          at <Jasmine>
          at processImmediate ([34minternal/timers.js:456:21[39m)

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, [1m[38;2;35;209;139m1 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
