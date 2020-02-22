import util from "util";
import path from "path";
import globby from "globby";
import yargsParser from "yargs-parser";
import { Config } from "@zayith/core";
// @ts-ignore
import makeModuleEnv from "make-module-env";
import makeDebug from "debug";

const debug = makeDebug("@zayith/cli:config.ts");

type CliConfig = {
  testFiles: Array<string>; // glob strings
  reporters?: Array<string>;
  loader?: string;
  seed?: number;
  help?: boolean;
  version?: boolean;
  resolveExtensions?: Array<string>;
};

export const usage = [
  `Usage: zayith [options] [testFileGlobs...]`,
  `Examples:`,
  `  zayith`,
  `  zayith --help`,
  `  zayith './tests/**/*.js'`,
  `  zayith --seed 1234`,
  `  zayith --seed 1234 './tests/**/*.js'`,
  `  zayith './tests/**/*.js' '!**/*.snapshot.js'`,
  ``,
  `Options:`,
  `  --reporters: Specify which test reporter module(s) to use.`,
  ``,
  `    Example: zayith --reporter some-reporter-from-npm`,
  `    Example: zayith --reporter ./my-reporter.js`,
  `    Example: zayith --reporter ./my-reporter.js,another-reporter`,
  ``,
  `    Reporters define what to print during (and after) a test run.`,
  `    When you run Zayith, and it prints a list of what failed, what`,
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
  `    Loader modules tell Zayith how to load your test files.`,
  ``,
  `    The default loader module uses fs.readFileSync to load your test`,
  `    file. However, you can write loaders that retrieve test files`,
  `    however makes sense for your project; for example, you could`,
  `    write a loader that retrieves your files via http.`,
  ``,
  `    Loaders can also compile your test code, using eg.`,
  `    Babel, TypeScript, or Webpack.`,
  ``,
  `    A loader module should export a function that receives a`,
  `    string (the file to load), and returns a string (the code to`,
  `	   execute in the browser).`,
  ``,
  `    Example: zayith --loader some-loader-from-npm`,
  `    Example: zayith --loader ./my-loader.js`,
  ``,
  `  --resolve-extensions: Specify which extensions should be implicitly resolved by require.`,
  ``,
  `    This option configures which filetype extensions can be`,
  `    required without needing the extension in the string passed`,
  `    into require.`,
  ``,
  `    The default value is "js,json,mjs,jsx,ts,tsx,node".`,
  ``,
  `    Example: zayith --resolve-extensions js,jsx,json,mjs,png`,
  ``,
  `  --seed: Specify a seed for Zayith's random test ordering.`,
  ``,
  `    Zayith runs tests in a random order by default, to help you`,
  `    avoid situations where code from one test is leaking into`,
  `    another.`,
  ``,
  `    However, if you need the order that your tests run in to be`,
  `    deterministic, you can specify a seed value, and the tests`,
  `    will run in the same order each time.`,
  ``,
  `    Example: zayith --seed 1234`,
  `    Example: zayith --seed 7`,
  ``,
  `  --help: Show this usage text.`,
  ``,
  `    Example: zayith --help`,
  ``,
  `  --version: Show the versions of @zayith/cli and @zayith/core.`,
  ``,
  `    Example: zayith --version`,
].join("\n");

export function parseArgvIntoCliConfig(argv: Array<string>): CliConfig {
  debug(`Parsing argv with yargs: ${util.inspect(argv)}`);

  const opts = yargsParser(argv, {
    string: ["loader", "resolveExtensions"],
    array: ["reporters"],
    number: ["seed"],
    boolean: ["halp, varsion"],
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
    resolveExtensions: opts.resolveExtensions
      ? opts.resolveExtensions
          .split(",")
          .map((ext: string) => (ext.startsWith(".") ? ext : "." + ext))
      : undefined,
  };
}

export function convertCliConfig(cliConfig: CliConfig): Config {
  const env = makeModuleEnv(path.join(process.cwd(), "zayith-context.js"));

  const outputConfig: Config = {
    testFiles: globby.sync(cliConfig.testFiles),
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
    let result = env.require(cliConfig.loader);
    if (result.__esModule && result.default) result = result.default;

    outputConfig.loader = result;
  }

  if (cliConfig.seed != null) {
    outputConfig.seed = cliConfig.seed;
  }

  if (cliConfig.resolveExtensions) {
    outputConfig.resolveExtensions = cliConfig.resolveExtensions;
  }

  return outputConfig;
}
