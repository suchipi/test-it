import util from "util";
import chalk from "chalk";
import { runTests } from "@test-it/core";
import { CliConfig, convertCliConfig } from "./config";
import makeDebug from "debug";
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import { format } from "date-fns";

const debug = makeDebug("@test-it/cli:watch.ts");

function clearScreen() {
  process.stdout.write("\u001b[2J\u001b[0;0H"); // Clear screen
  process.stdout.write("\u001b[3J"); // Clear scrollback
}

export default async function watch(cliConfig: CliConfig) {
  let fileFilter: null | RegExp = null;
  let abortRequested = false;

  const runTestsPass = async function runTestsPass() {
    debug(`running test pass`);
    abortRequested = false;

    const config = await convertCliConfig(cliConfig);
    config.testFiles = config.testFiles.filter((filename) => {
      debug(
        `Comparing ${filename} against current filter: ${String(fileFilter)}`
      );
      return fileFilter ? fileFilter.test(filename) : true;
    });
    debug(`Parsed Config: ${util.inspect(config)}`);

    config.shouldAbort = () => abortRequested;

    const result = await runTests(config);
    debug(`Tests result: ${JSON.stringify(result)}`);

    let label: string = result;
    try {
      label = {
        failed: chalk.red.bold,
        passed: chalk.green.bold,
        canceled: chalk.yellow.bold,
      }[result](result);
    } catch (err) {
      // In case I add more results in the future (people could have mismatching cli/core versions)
    }

    console.log(
      chalk`{dim Test run ${label} at ${format(new Date(), "hh:mm:ss")}.}`
    );

    if (fileFilter) {
      console.log(
        chalk`{bgYellow.black Current test file filter: {bold ${fileFilter.toString()}}}. {dim To clear the filter, type }{bold clear} {dim and press enter.}`
      );
    }

    console.log(
      chalk`\n{dim To run tests again, press enter. To exit, type }{bold exit} {dim and press enter. For more commands, type }{bold help} {dim and press enter.}`
    );
    process.stdout.write("> ");
  };

  let currentPass: Promise<void | null> | null = null;

  const doRun = () => {
    debug(`doRun called at ${Date.now()}`);

    if (currentPass) {
      debug(`run in progress; aborting and pending new run`);
      abortRequested = true;
      currentPass.then(doRun);
    } else {
      clearScreen();
      currentPass = runTestsPass().then(
        () => (currentPass = null),
        () => (currentPass = null)
      );
    }
  };

  const debouncedDoRun = debounce(doRun, 100);

  const watcher = chokidar.watch([".", "!**/node_modules/**", "!**/.git/**"]);

  watcher.on("add", (_path) => {
    debug(`watcher: add: ${_path}`);

    debouncedDoRun();
  });
  watcher.on("change", (_path) => {
    debug(`watcher: change: ${_path}`);

    debouncedDoRun();
  });
  watcher.on("unlink", (_path) => {
    debug(`watcher: unlink: ${_path}`);

    debouncedDoRun();
  });
  watcher.on("addDir", (_path) => {
    debug(`watcher: addDir: ${_path}`);

    debouncedDoRun();
  });
  watcher.on("unlinkDir", (_path) => {
    debug(`watcher: unlinkDir: ${_path}`);

    debouncedDoRun();
  });
  watcher.on("error", (error) => {
    debug(`watcher: error: ${util.inspect(error)}`);
  });

  let awaitingPattern = false;

  await new Promise((resolve) => {
    process.stdin.on("data", (data) => {
      const stringData = data.toString("utf-8");

      if (awaitingPattern) {
        awaitingPattern = false;
        const trimmed = stringData.trim();
        if (trimmed.length === 0) {
          fileFilter = null;
        } else {
          fileFilter = new RegExp(trimmed);
        }
        debouncedDoRun();
      } else {
        switch (stringData) {
          case "q\n":
          case "quit\n":
          case "exit\n": {
            resolve();
            break;
          }

          case "run\n":
          case "\n": {
            debouncedDoRun();
            break;
          }

          case "p\n":
          case "pattern\n":
          case "filter\n": {
            if (currentPass) {
              abortRequested = true;
              console.log("Canceling run...");

              currentPass.then(() => {
                awaitingPattern = true;
                process.stdout.write("\nPlease enter a test filter: ");
              });
            } else {
              awaitingPattern = true;
              process.stdout.write("Please enter a test filter: ");
            }

            break;
          }

          case "x\n":
          case "stop\n": {
            if (currentPass) {
              abortRequested = true;
              console.log("Canceling run...");
            } else {
              process.stdout.write("> ");
            }
            break;
          }

          case "a\n":
          case "all\n":
          case "clear\n": {
            fileFilter = null;
            debouncedDoRun();
            break;
          }

          case "help\n": {
            console.log(`List of commands:\n`);
            console.log(
              chalk`{bold run}: Run the tests. {dim Shortcut: press enter with no command}`
            );
            console.log(
              chalk`{bold quit}, {bold exit}: Exit watch mode. {dim Shortcut: {bold q}}`
            );
            console.log(
              chalk`{bold pattern}, {bold filter}: Filter which test files to run, by name. {dim Shortcut: {bold p}}`
            );
            console.log(
              chalk`{bold all}, {bold clear}: Clear the test file filter and run all tests. {dim Shortcut: {bold a}}`
            );
            console.log(
              chalk`{bold stop}: Stop the current test run. {dim Shortcut: {bold x}}`
            );
            process.stdout.write("\n\n> ");
            break;
          }

          default: {
            console.log(
              chalk`{red Unrecognized command:} {bold ${stringData.trim()}}. For help, type {bold help} and press enter.`
            );
            process.stdout.write("> ");
          }
        }
      }
    });

    process.on("SIGINT", resolve);
    process.on("SIGTERM", resolve);
  });
}
