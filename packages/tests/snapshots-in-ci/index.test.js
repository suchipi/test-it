const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const runTestIt = require("../run-test-it");

test("snapshot-testing", async () => {
  shelljs.rm("-rf", path.join(__dirname, "index.test-it.js.snap"));

  const result = await runTestIt([path.join(__dirname, "index.test-it.js")], {
    env: {
      ...process.env,
      CI: "true",
    },
  });

  expect(result.stdout).toMatchInlineSnapshot(`
    "[31m✕ snapshots-in-ci/index.test-it.js snapshots-in-ci first test[39m

    [38;2;241;76;76m[1m● snapshots-in-ci/index.test-it.js snapshots-in-ci first test[22m[39m

      Error: Tried to write to a new snapshot in CI: '<rootDir>/packages/tests/snapshots-in-ci/index.test-it.js' 'snapshots-in-ci first test 1'. Did you forget to commit your snapshots?
      Error: Tried to write to a new snapshot in CI: '<rootDir>/packages/tests/snapshots-in-ci/index.test-it.js' 'snapshots-in-ci first test 1'. Did you forget to commit your snapshots?
          at Object.toMatchSnapshot ([34m<rootDir>/packages/core/dist/make-expect.js:39:23[39m)
          at __EXTERNAL_MATCHER_TRAP__ ([34m<rootDir>/node_modules/expect/build/index.js:325:30[39m)
          at Object.throwingMatcher [as toMatchSnapshot] ([34m<rootDir>/node_modules/expect/build/index.js:326:15[39m)
          at <Jasmine>
          at process.processImmediate ([34mnode:internal/timers:478:21[39m)

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);

  expect(fs.existsSync(path.join(__dirname, "index.test-it.js.snap"))).toBe(
    false
  );
});
