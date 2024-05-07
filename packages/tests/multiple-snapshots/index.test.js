const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const runTestIt = require("../run-test-it");

test("snapshot-testing", async () => {
  const result = await runTestIt([path.join(__dirname, "index.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ multiple-snapshots/index.test-it.js snapshot-testing first test[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);

  const snapshotContent = fs.readFileSync(
    path.join(__dirname, "index.test-it.js.snap"),
    "utf-8"
  );
  shelljs.rm(path.join(__dirname, "index.test-it.js.snap"));

  expect(snapshotContent).toMatchInlineSnapshot(`
    "// Jest Snapshot v1, https://goo.gl/fbAQLP

    exports[\`snapshot-testing first test 1\`] = \`
    Object {
      "number": "one",
    }
    \`;

    exports[\`snapshot-testing first test 2\`] = \`
    Object {
      "number": "two",
    }
    \`;
    "
  `);
});
