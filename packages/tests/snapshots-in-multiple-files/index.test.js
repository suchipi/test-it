const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const runTestIt = require("../run-test-it");

test("snapshot-testing", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ snapshots-in-multiple-files/first.test-it.js here we go first test[39m
    [32m✓ snapshots-in-multiple-files/second.test-it.js anotha one second test[39m

    [1m[1m[38;2;35;209;139m2 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);

  const firstSnapshotContent = fs.readFileSync(
    path.join(__dirname, "first.test-it.js.snap"),
    "utf-8"
  );
  shelljs.rm(path.join(__dirname, "first.test-it.js.snap"));

  expect(firstSnapshotContent).toMatchInlineSnapshot(`
    "// Jest Snapshot v1, https://goo.gl/fbAQLP

    exports[\`here we go first test\`] = \`
    Object {
      \\"number\\": \\"one\\",
    }
    \`;

    exports[\`here we go first test 2\`] = \`
    Object {
      \\"number\\": \\"two\\",
    }
    \`;
    "
  `);

  const secondSnapshotContent = fs.readFileSync(
    path.join(__dirname, "second.test-it.js.snap"),
    "utf-8"
  );
  shelljs.rm(path.join(__dirname, "second.test-it.js.snap"));

  expect(secondSnapshotContent).toMatchInlineSnapshot(`
    "// Jest Snapshot v1, https://goo.gl/fbAQLP

    exports[\`anotha one second test\`] = \`
    Object {
      \\"number\\": \\"three\\",
    }
    \`;

    exports[\`anotha one second test 2\`] = \`
    Object {
      \\"number\\": \\"four\\",
    }
    \`;
    "
  `);
});
