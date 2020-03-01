const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const runTestIt = require("../run-test-it");

test("snapshot-testing", async () => {
  shelljs.cp(
    path.join(__dirname, "index.test-it.js.snap.starting-snapshot"),
    path.join(__dirname, "index.test-it.js.snap")
  );

  expect(
    fs.readFileSync(path.join(__dirname, "index.test-it.js.snap"), "utf-8")
  ).toMatchInlineSnapshot(`
    "// Jest Snapshot v1, https://goo.gl/fbAQLP

    exports[\`snapshot-testing first test 1\`] = \`
    Object {
      \\"haha\\": \\"woop woop\\",
    }
    \`;

    exports[\`snapshot-testing second test 1\`] = \`[Error: hi]\`;
    "
  `);

  const result = await runTestIt([path.join(__dirname, "*.test-it.js"), "-u"], {
    cwd: __dirname,
  });

  expect(result.stdout).toMatchInlineSnapshot(`
    "[32m✓ index.test-it.js snapshot-testing second test[39m
    [32m✓ index.test-it.js snapshot-testing first test[39m

    [1m[1m[38;2;35;209;139m2 passed[39m[22m[1m, 2 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);

  expect(
    fs.readFileSync(path.join(__dirname, "index.test-it.js.snap"), "utf-8")
  ).toMatchInlineSnapshot(`
"// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[\`snapshot-testing first test 1\`] = \`
Object {
  \\"haha\\": \\"yolo\\",
}
\`;

exports[\`snapshot-testing second test 1\`] = \`[Error: hi]\`;
"
`);

  shelljs.rm(path.join(__dirname, "index.test-it.js.snap"));
});
