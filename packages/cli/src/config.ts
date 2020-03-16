import util from "util";
import path from "path";
import globby from "globby";
import yargsParser from "yargs-parser";
import { Config } from "@test-it/core";
import makeModuleEnv from "make-module-env";
import makeDebug from "debug";

const debug = makeDebug("@test-it/cli:config.ts");

export type CliConfig = {
  testFiles: Array<string>; // glob strings
  reporters?: Array<string>;
  loader?: string;
  resolver?: string;
  seed?: number;
  help?: boolean;
  version?: boolean;
  updateSnapshots: boolean;
  testSetupFiles?: Array<string>;
  watch?: boolean;
};

export const usage = [
  `Usage: test-it [options] [testFileGlobs...]`,
  `Examples:`,
  `  test-it`,
  `  test-it --help`,
  `  test-it './tests/**/*.js'`,
  `  test-it --seed 1234`,
  `  test-it --seed 1234 './tests/**/*.js'`,
  `  test-it './tests/**/*.js' '!**/*.snapshot.js'`,
  ``,
  `Options:`,
  `  --watch: Watch files and re-run tests on change.`,
  ``,
  `    Runs the tests repeatedly in an interactive watch mode.`,
  ``,
  `    Example: test-it --watch`,
  ``,
  `  --test-setup-files: A comma-separated list of files to run before each test file.`,
  ``,
  `    A comma-separated list of paths to modules that run some code to`,
  `    configure or set up the testing environment.`,
  ``,
  `    Example: test-it --test-setup-files ./test-setup.js`,
  `    Example: test-it --test-setup-files ./test-setup.js,./other-test-setup.js`,
  ``,
  `  --reporters: Specify which test reporter module(s) to use.`,
  ``,
  `    Example: test-it --reporter some-reporter-from-npm`,
  `    Example: test-it --reporter ./my-reporter.js`,
  `    Example: test-it --reporter ./my-reporter.js,another-reporter`,
  ``,
  `    Reporters define what to print during (and after) a test run.`,
  `    When you run Test-It, and it prints a list of what failed, what`,
  `    succeeded, what's pending, etc... that's being printed by your`,
  `    reporter.`,
  ``,
  `    A test reporter module should export either a Jasmine reporter`,
  `    class, or an instance of a Jasmine reporter class.`,
  ``,
  `    If you don't specify any reporter(s), a default built-in`,
  `    reporter will be used.`,
  ``,
  `  --loader: Specify which loader module to use.`,
  ``,
  `    Loader modules tell Test-It how to load and compile your test files.`,
  ``,
  `    The default loader module supports ES2020, React, TypeScript, and Flow.`,
  ``,
  `    A loader module should export a function that receives a`,
  `    string (the file to load), and returns a string (the code to`,
  `     execute in the browser). Loader modules must be synchronous,`,
  `     because they're called when 'require' is called.`,
  ``,
  `    Example: test-it --loader some-loader-from-npm`,
  `    Example: test-it --loader ./my-loader.js`,
  ``,
  `  --resolver: Specify which resolver module to use.`,
  ``,
  `    Resolver modules tell Test-It how to translate the string in`,
  `    a require or import into the absolute path of a file on disk.`,
  ``,
  `    The default resolver uses node's node_module lookup algorithm,`,
  `    and allows you to omit the file extension for the following filetypes:`,
  `    '.js', '.json', '.mjs', '.jsx', '.ts', and '.tsx'.`,
  ``,
  `    A resolver module should be defined according to the`,
  `    eslint-plugin-import resolver spec v2 as defined at the`,
  `    following url:`,
  ``,
  `    https://github.com/benmosher/eslint-plugin-import/blob/b916ed2b574a107e62f819663b8c300f82d82d8d/resolvers/README.md`,
  ``,
  `    Example: test-it --resolver some-resolver-from-npm`,
  `    Example: test-it --resolver ./my-resolver.js`,
  ``,
  `  --update-snapshots, -u: Update test snapshots.`,
  ``,
  `    This option force-updates any test snapshots created with`,
  `    'expect(...).toMatchSnapshot()'.`,
  ``,
  `    Example: test-it --update-snapshots`,
  `    Example: test-it -u`,
  ``,
  `  --seed: Specify a seed for Test-It's random test ordering.`,
  ``,
  `    Test-It runs tests in a random order by default, to help you`,
  `    avoid situations where code from one test is leaking into`,
  `    another.`,
  ``,
  `    However, if you need the order that your tests run in to be`,
  `    deterministic, you can specify a seed value, and the tests`,
  `    will run in the same order each time.`,
  ``,
  `    Example: test-it --seed 1234`,
  `    Example: test-it --seed 7`,
  ``,
  `  --help: Show this usage text.`,
  ``,
  `    Example: test-it --help`,
  ``,
  `  --version: Show the versions of @test-it/cli and @test-it/core.`,
  ``,
  `    Example: test-it --version`,
].join("\n");

export function parseArgvIntoCliConfig(argv: Array<string>): CliConfig {
  debug(`Parsing argv with yargs: ${util.inspect(argv)}`);

  const opts = yargsParser(argv, {
    string: ["loader", "resolver", "testSetupFiles"],
    array: ["reporters"],
    number: ["seed"],
    boolean: ["halp", "varsion", "updateSnapshots", "u", "watch"],
  });

  debug(`Yargs result: ${util.inspect(opts)}`);

  return {
    testFiles:
      opts._ && opts._.length > 0
        ? opts._
        : ["**/?(*.)+(spec|test).[jt]s?(x)", "!**/node_modules/**"],
    reporters: (Array.isArray(opts.reporters)
      ? opts.reporters
      : [opts.reporters]
    ).filter(Boolean),
    loader: opts.loader,
    seed: opts.seed,
    help: opts.halp,
    version: opts.varsion,
    resolver: opts.resolver,
    testSetupFiles: opts.testSetupFiles
      ? opts.testSetupFiles
          .split(",")
          .map((filepath: string) =>
            filepath.startsWith(".")
              ? path.resolve(process.cwd(), filepath)
              : filepath
          )
      : undefined,
    updateSnapshots: Boolean(opts.updateSnapshots || opts.u),
    watch: opts.watch,
  };
}

export async function convertCliConfig(cliConfig: CliConfig): Promise<Config> {
  const env = makeModuleEnv(path.join(process.cwd(), "test-it-context.js"));

  debug(`Expanding globs: ${util.inspect(cliConfig.testFiles)}`);
  const testFiles = await globby(cliConfig.testFiles);

  const outputConfig: Config = {
    testFiles,
    updateSnapshots: cliConfig.updateSnapshots
      ? "all"
      : process.env.CI === "true"
      ? "none"
      : "new",
  };

  if (cliConfig.reporters) {
    outputConfig.reporters = cliConfig.reporters.map((reporterString) => {
      let result = env.require(reporterString);
      if (result.__esModule && result.default) result = result.default;

      if (typeof result === "function") {
        return new result();
      } else {
        return result;
      }
    });
  }

  if (cliConfig.loader) {
    outputConfig.loader = cliConfig.loader;
  }

  if (cliConfig.resolver) {
    outputConfig.resolver = cliConfig.resolver;
  }

  if (cliConfig.seed != null) {
    outputConfig.seed = cliConfig.seed;
  }

  outputConfig.testSetupFiles = cliConfig.testSetupFiles;

  return outputConfig;
}
