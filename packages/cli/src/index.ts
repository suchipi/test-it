import util from "util";
import chalk from "chalk";
import { runTests } from "@test-it/core";
import { usage, parseArgvIntoCliConfig, convertCliConfig } from "./config";
import makeDebug from "debug";

const debug = makeDebug("@test-it/cli:index.ts");

async function main() {
  try {
    const cliConfig = parseArgvIntoCliConfig(process.argv.slice(2));
    debug(`Parsed CliConfig: ${util.inspect(cliConfig)}`);

    if (cliConfig.help) {
      console.error(usage);
    } else if (cliConfig.version) {
      console.log(`@test-it/cli: ${require("../package.json").version}`);
      console.log(
        `@test-it/core: ${require("@test-it/core/package.json").version}`
      );
    } else {
      const config = convertCliConfig(cliConfig);
      debug(`Parsed Config: ${util.inspect(config)}`);

      const results = await runTests(config);
      debug(`Results: ${JSON.stringify(results)}`);

      if (results.overallStatus === "failed") {
        process.exitCode = 1;
      } else {
        process.exitCode = 0;
      }
    }
  } catch (err) {
    debug(`Error occurred: ${err.stack}`);

    console.error(chalk.red(err.stack || err));
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

main();
