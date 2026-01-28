const path = require("path");
const runTestIt = require("../run-test-it");

test("syntax error", async () => {
  const result = await runTestIt([path.join(__dirname, "*.test-it.js")]);

  expect(result.stdout).toMatchInlineSnapshot(`
    "[31m✕ syntax-error/index.test-it.js[39m

    [38;2;241;76;76m[1m● syntax-error/index.test-it.js[22m[39m

      Error:   x Expected ';', '}' or <eof>
         ,-[<rootDir>/packages/tests/syntax-error/index.test-it.js:1:1]
       1 | syntax error in file
         : ^^^|^^ ^^^^^
         :    \`-- This is the expression part of an expression statement
         \`----
      
      
      Caused by:
          Syntax Error
      error properties: Object({ code: 'GenericFailure' })
          at <Jasmine>
          at Compiler.transformFileSync ([34m<rootDir>/node_modules/@swc/core/index.js:302:25[39m)
          at Object.transformFileSync ([34m<rootDir>/node_modules/@swc/core/index.js:371:21[39m)
          at loadJsCompiled ([34m<rootDir>/node_modules/kame/dist/default-loader.js:72:24[39m)
          at Object.defaultLoader [as load] ([34m<rootDir>/node_modules/kame/dist/default-loader.js:145:24[39m)
          at exports.load [as loader] ([34m<rootDir>/packages/default-loader/index.js:4:29[39m)
          at Object.read ([34m<rootDir>/packages/core/node_modules/kame/dist/runtime.js:68:41[39m)
          at Module._load ([34m<rootDir>/node_modules/commonjs-standalone/dist/index.js:42:33[39m)
          at Runtime._run ([34m<rootDir>/packages/core/node_modules/kame/dist/runtime.js:145:53[39m)
          at Runtime.load ([34m<rootDir>/packages/core/node_modules/kame/dist/runtime.js:141:25[39m)
          at Suite.<anonymous> ([34m<rootDir>/packages/core/dist/index.js:217:21[39m)
          at <Jasmine>
          at bluebird_1.default.map.concurrency ([34m<rootDir>/packages/core/dist/index.js:211:23[39m)

    [1m[1m[38;2;241;76;76m1 failed[39m[22m[1m, 1 total[22m
    "
  `);
  expect(result.stderr).toBe("");
  expect(result.code).toBe(1);
});
