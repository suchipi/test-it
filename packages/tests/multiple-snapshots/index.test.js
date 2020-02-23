const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const runZayith = require("../run-zayith");

test("snapshot-testing", async () => {
  const result = await runZayith([path.join(__dirname, "index.zayith.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "multiple-snapshots/index.zayith.js
      snapshot-testing
        [32m✓ first test[39m

    [1m[1m[38;2;35;209;139m1 passed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);

  const snapshotContent = fs.readFileSync(
    path.join(__dirname, "index.zayith.js.snap"),
    "utf-8"
  );
  shelljs.rm(path.join(__dirname, "index.zayith.js.snap"));

  expect(snapshotContent).toMatchInlineSnapshot(`
    "// Jest Snapshot v1, https://goo.gl/fbAQLP

    exports[\`snapshot-testing first test\`] = \`
    Object {
      \\"number\\": \\"one\\",
    }
    \`;

    exports[\`snapshot-testing first test 2\`] = \`
    Object {
      \\"number\\": \\"two\\",
    }
    \`;
    "
  `);
});
