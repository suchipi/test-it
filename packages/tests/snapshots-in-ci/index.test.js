const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const runTestIt = require("../run-test-it");

test("snapshot-testing", async () => {
  const result = await runTestIt([path.join(__dirname, "index.test-it.js")], {
    env: {
      ...process.env,
      CI: "true",
    },
  });

  expect(result.stdout).toMatchInlineSnapshot(`
    "[31m✕ snapshots-in-ci/index.test-it.js snapshots-in-ci first test[39m

    [38;2;241;76;76m[1m● snapshots-in-ci/index.test-it.js snapshots-in-ci first test[22m[39m

      Error: [1m[31mexpected value to match snapshot snapshots-in-ci first test[39m[22m
      
      [32m- Snapshot[39m
      [31m+ Received[39m
      
      [31m+ Object {[39m
      [31m+   \\"number\\": \\"one\\",[39m
      [31m+ }[39m
      error properties: Object({ matcherResult: Object({ message: Function, pass: false }) })
          at <Jasmine>
          at processImmediate ([34minternal/timers.js:456:21[39m)

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);

  expect(fs.existsSync(path.join(__dirname, "index.test-it.js.snap"))).toBe(
    false
  );
});
