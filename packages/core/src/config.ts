import fs from "fs";
import util from "util";
import { SpecReporter } from "jasmine-spec-reporter";
import makeDebug from "debug";

const debug = makeDebug("@zayith/core:config.ts");

export type PartialConfig = {
  testFiles: Array<string>;
  reporters?: Array<jasmine.CustomReporter>;
  loader?: (filename: string) => Promise<string>;
  seed?: number;
};

export type NormalizedConfig = {
  testFiles: Array<string>;
  reporters: Array<jasmine.CustomReporter>;
  loader: (filename: string) => Promise<string>;
  seed?: number;
};

export function normalizeConfig(config: PartialConfig): NormalizedConfig {
  debug(`Parsing PartialConfig: ${util.inspect(config)}`);
  return {
    testFiles: config.testFiles,
    reporters:
      config.reporters && config.reporters.length > 0
        ? config.reporters
        : [new SpecReporter()],
    loader:
      config.loader ||
      (async (filename: string) => {
        const code = await util.promisify(fs.readFile)(filename, "utf-8");
        return code;
      }),
    seed: config.seed,
  };
}
