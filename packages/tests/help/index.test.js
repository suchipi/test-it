const path = require("path");
const runZayith = require("../run-zayith");

test("help", async () => {
  const result = await runZayith(["--help"], { skipSanitization: true });

  expect(result.stdout).toBe("");
  expect(result.stderr).toMatchInlineSnapshot(`
    "Usage: zayith [options] [testFileGlobs...]
    Examples:
      zayith
      zayith --help
      zayith './tests/**/*.js'
      zayith --seed 1234
      zayith --seed 1234 './tests/**/*.js'
      zayith './tests/**/*.js' '!**/*.snapshot.js'

    Options:
      --reporters: Specify which test reporter module(s) to use.

        Example: zayith --reporter some-reporter-from-npm
        Example: zayith --reporter ./my-reporter.js
        Example: zayith --reporter ./my-reporter.js,another-reporter

        Reporters define what to print during (and after) a test run.
        When you run Zayith, and it prints a list of what failed, what
        succeeded, what's pending, etc... that's being printed by your
        reporter.

        A test reporter module should export either a Jasmine reporter
        class, or an instance of a Jasmine reporter class.

        If you don't specify any reporter(s), a default built-in
        reporter will be used.

      --loader: Specify which loader module to use.

        Loader modules tell Zayith how to load and compile your test files.

        The default loader module supports ES2020, React, TypeScript, and Flow.

        A loader module should export a function that receives a
        string (the file to load), and returns a string (the code to
    	   execute in the browser). Loader modules must be synchronous,
    	   because they're called when 'require' is called.

        Example: zayith --loader some-loader-from-npm
        Example: zayith --loader ./my-loader.js

      --resolve-extensions: Specify which extensions should be implicitly resolved by require.

        This option configures which filetype extensions can be
        required without needing the extension in the string passed
        into require.

        The default value is \\"js,json,mjs,jsx,ts,tsx,node\\".

        Example: zayith --resolve-extensions js,jsx,json,mjs,png

      --seed: Specify a seed for Zayith's random test ordering.

        Zayith runs tests in a random order by default, to help you
        avoid situations where code from one test is leaking into
        another.

        However, if you need the order that your tests run in to be
        deterministic, you can specify a seed value, and the tests
        will run in the same order each time.

        Example: zayith --seed 1234
        Example: zayith --seed 7

      --help: Show this usage text.

        Example: zayith --help

      --version: Show the versions of @zayith/cli and @zayith/core.

        Example: zayith --version
    "
  `);
  expect(result.code).toBe(0);
});
