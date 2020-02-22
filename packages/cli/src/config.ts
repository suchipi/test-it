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
};

function parseArgvIntoCliConfig(argv: Array<string>): CliConfig {
  debug(`Parsing argv with yargs: ${util.inspect(argv)}`);

  const opts = yargsParser(argv, {
    string: ["loader"],
    array: ["reporters"],
    number: ["seed"],
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
  };
}

function convertCliConfig(cliConfig: CliConfig): Config {
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

  return outputConfig;
}

export function parseArgv(argv: Array<string>): Config {
  const cliConfig = parseArgvIntoCliConfig(argv);
  debug(`Parsed CliConfig: ${util.inspect(cliConfig)}`);
  const config = convertCliConfig(cliConfig);
  debug(`Parsed Config: ${util.inspect(config)}`);
  return config;
}
