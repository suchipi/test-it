import util from "util";
import DefaultReporter from "@test-it/default-reporter";
import defaultLoader from "@test-it/default-loader";
import makeDebug from "debug";

const debug = makeDebug("@test-it/core:config.ts");

export type PartialConfig = {
  testFiles: Array<string>;
  reporters?: Array<jasmine.CustomReporter>;
  loader?: (filename: string) => string;
  resolveExtensions?: Array<string>;
  seed?: number;
  updateSnapshots: "all" | "new" | "none";
  testSetupFiles?: Array<string>;
  shouldAbort?: () => boolean;
};

export type NormalizedConfig = {
  testFiles: Array<string>;
  reporters: Array<jasmine.CustomReporter>;
  loader: (filename: string) => string;
  resolveExtensions: Array<string>;
  seed?: number;
  updateSnapshots: "all" | "new" | "none";
  testSetupFiles: Array<string>;
  shouldAbort: () => boolean;
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
    updateSnapshots: config.updateSnapshots,
    testSetupFiles: config.testSetupFiles || [],
    shouldAbort: config.shouldAbort || (() => false),
  };
}
