const path = require("path");
const runTestIt = require("../run-test-it");

test("help", async () => {
  const result = await runTestIt(["--help"]);

  expect(result.stdout).toBe("");
  expect(result.stderr).toMatchInlineSnapshot(`
    "Usage: test-it [options] [testFileGlobs...]
    Examples:
      test-it
      test-it --help
      test-it './tests/**/*.js'
      test-it --seed 1234
      test-it --seed 1234 './tests/**/*.js'
      test-it './tests/**/*.js' '!**/*.snapshot.js'

    Options:
      --watch: Watch files and re-run tests on change.

        Runs the tests repeatedly in an interactive watch mode.

        Example: test-it --watch

      --test-setup-files: A comma-separated list of files to run before each test file.

        A comma-separated list of paths to modules that run some code to
        configure or set up the testing environment.

        Example: test-it --test-setup-files ./test-setup.js
        Example: test-it --test-setup-files ./test-setup.js,./other-test-setup.js

      --reporters: Specify which test reporter module(s) to use.

        Example: test-it --reporter some-reporter-from-npm
        Example: test-it --reporter ./my-reporter.js
        Example: test-it --reporter ./my-reporter.js,another-reporter

        Reporters define what to print during (and after) a test run.
        When you run Test-It, and it prints a list of what failed, what
        succeeded, what's pending, etc... that's being printed by your
        reporter.

        A test reporter module should export either a Jasmine reporter
        class, or an instance of a Jasmine reporter class.

        If you don't specify any reporter(s), a default built-in
        reporter will be used.

      --loader: Specify which loader module to use.

        Loader modules tell Test-It how to load and compile your test files.

        The default loader module supports ES2020, React, TypeScript, and Flow.

        A loader module should export a function named "load" that receives a
        string (the file to load), and returns a string (the code to execute in
        the browser). Loader modules must be synchronous, because they're
        called when 'require' is called.

        Loader modules are passed directly to \`kame\`. Run \`npx kame --help\` and
        read the section on loaders for more info.

        Example: test-it --loader some-loader-from-npm
        Example: test-it --loader ./my-loader.js

      --resolver: Specify which resolver module to use.

        Resolver modules tell Test-It how to translate the string in
        a require or import into the absolute path of a file on disk.

        The default resolver uses node's node_module lookup algorithm,
        and allows you to omit the file extension for the following filetypes:
        '.js', '.json', '.mjs', '.jsx', '.ts', and '.tsx'.

        Resolver modules are passed directly to \`kame\`. Run \`npx kame --help\`
        and read the section on resolvers for more info.

        Example: test-it --resolver some-resolver-from-npm
        Example: test-it --resolver ./my-resolver.js

      --update-snapshots, -u: Update test snapshots.

        This option force-updates any test snapshots created with
        'expect(...).toMatchSnapshot()'.

        Example: test-it --update-snapshots
        Example: test-it -u

      --seed: Specify a seed for Test-It's random test ordering.

        Test-It runs tests in a random order by default, to help you
        avoid situations where code from one test is leaking into
        another.

        However, if you need the order that your tests run in to be
        deterministic, you can specify a seed value, and the tests
        will run in the same order each time.

        Example: test-it --seed 1234
        Example: test-it --seed 7

      --url: Specify the url to run tests in

        All tests run in an invisible browser window. By default, this window is open
        to "about:blank". If you'd like your tests to run on a different page, you
        can specify a different page.

        Example: test-it --url http://localhost:8080/

      --watch-ignore: Specify files not to watch

        A comma-separated list of globs matching files that, if changed, watch mode
        should not re-run tests for. You may wish to use this to ignore changes to
        compiled files or test fixtures.

        Example: test-it --watch-ignore **/*.js,**/*.css

      --help: Show this usage text.

        Example: test-it --help

      --version: Show the versions of @test-it/cli and @test-it/core.

        Example: test-it --version
    "
  `);
  expect(result.code).toBe(0);
});
