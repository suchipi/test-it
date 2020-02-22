import util from "util";
import DefaultReporter from "@zayith/default-reporter";
// @ts-ignore
import defaultLoader from "@zayith/default-loader";
import makeDebug from "debug";

const debug = makeDebug("@zayith/core:config.ts");

export type PartialConfig = {
  testFiles: Array<string>;
  reporters?: Array<jasmine.CustomReporter>;
  loader?: (filename: string) => string;
  resolveExtensions?: Array<string>;
  seed?: number;
};

export type NormalizedConfig = {
  testFiles: Array<string>;
  reporters: Array<jasmine.CustomReporter>;
  loader: (filename: string) => string;
  resolveExtensions: Array<string>;
  seed?: number;
};

export function normalizeConfig(config: PartialConfig): NormalizedConfig {
  debug(`Parsing PartialConfig: ${util.inspect(config)}`);
  return {
    testFiles: config.testFiles,
    reporters:
      config.reporters && config.reporters.length > 0
        ? config.reporters
        : [new DefaultReporter()],
    loader: config.loader || defaultLoader,
    resolveExtensions:
      config.resolveExtensions && config.resolveExtensions.length > 0
        ? config.resolveExtensions
        : [".js", ".json", ".mjs", ".jsx", ".ts", ".tsx", ".node"],
    seed: config.seed,
  };
}
