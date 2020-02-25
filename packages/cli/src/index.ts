import util from "util";
import chalk from "chalk";
import { runTests } from "@test-it/core";
import { usage, parseArgvIntoCliConfig, convertCliConfig } from "./config";
import makeDebug from "debug";
import watch from "./watch";

const debug = makeDebug("@test-it/cli:index.ts");

function openWindow(url: string, options: nw.IWindowOptions) {
  return new Promise<nw.Window>((resolve) =>
    nw.Window.open(url, options, resolve)
  );
}

async function main() {
  try {
    const cliConfig = parseArgvIntoCliConfig(process.argv.slice(2));
    debug(`Parsed CliConfig: ${util.inspect(cliConfig)}`);

    // Open dummy window so that process doesn't exit when last test window is closed.
    // This window will get closed when we call process.exit.
    await openWindow("about:blank", { show: false });

    if (cliConfig.help) {
      console.error(usage);
    } else if (cliConfig.version) {
      console.log(`@test-it/cli: ${require("../package.json").version}`);
      console.log(
        `@test-it/core: ${require("@test-it/core/package.json").version}`
      );
    } else if (cliConfig.watch) {
      await watch(cliConfig);
    } else {
      const config = await convertCliConfig(cliConfig);
      debug(`Parsed Config: ${util.inspect(config)}`);

      const result = await runTests(config);
      debug(`Tests result: ${JSON.stringify(result)}`);

      if (result === "passed") {
        process.exitCode = 0;
      } else {
        process.exitCode = 1;
      }
    }
  } catch (err) {
    debug(`Error occurred: ${err.stack}`);

    console.error(chalk.red(err.stack || err));
    process.exitCode = 1;
  }

  debug(`Exiting`);
  process.exit();
}

main();
