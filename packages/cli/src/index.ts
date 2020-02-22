import chalk from "chalk";
import { runTests } from "@zayith/core";
import { parseArgv } from "./config";
import makeDebug from "debug";

const debug = makeDebug("@zayith/cli:index.ts");

async function main() {
  debug("Opening dummy window");
  const dummyWindow: nw.Window = await new Promise((resolve) => {
    nw.Window.open("", { show: false }, resolve);
  });

  try {
    const config = parseArgv(process.argv.slice(2));
    const results = await runTests(config);
    debug(`Results: ${JSON.stringify(results)}`);

    if (results.overallStatus === "failed") {
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  } catch (err) {
    debug(`Error occurred: ${err.stack}`);

    console.error(chalk.red(err.stack || err));
    process.exitCode = 1;
  } finally {
    debug("Closing dummy window");
    dummyWindow.close();
  }
}

main();
