import path from "path";
import util from "util";
import chalk from "chalk";
import { runTests } from "@test-it/core";
import { CliConfig, convertCliConfig } from "./config";
import makeDebug from "debug";
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import picomatch from "picomatch";

const debug = makeDebug("@test-it/cli:watch.ts");

function clearScreen() {
  if (
    process.env.NO_CLEAR_SCREEN === "1" ||
    process.env.NO_CLEAR_SCREEN === "true"
  ) {
    return;
  }

  process.stdout.write("\u001b[2J\u001b[0;0H"); // Clear screen
  process.stdout.write("\u001b[3J"); // Clear scrollback
}

export default async function watch(cliConfig: CliConfig) {
  let fileFilter: null | RegExp = null;
  let abortRequested = false;
  let updateSnapshotsOnNextRun = false;

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
    if (updateSnapshotsOnNextRun) {
      config.updateSnapshots = "all";
      updateSnapshotsOnNextRun = false;
    }

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

  const watcher = chokidar.watch([
    ".",
    "!**/node_modules/**",
    "!**/.git/**",
    "!**/*.snap",
    "!**/*.png",
  ]);

  const watchIgnorePatterns = Array.isArray(cliConfig.watchIgnore)
    ? cliConfig.watchIgnore.map((pattern) => {
        debug(`received watch ignore pattern: ${pattern}`);

        // gross, but we have to put the absolute path in the pattern
        // itself for things to behave correctly...
        let normalizedPattern = pattern;
        if (!pattern.startsWith("**/") && !path.isAbsolute(pattern)) {
          normalizedPattern = path.resolve(process.cwd(), pattern);
        }

        return {
          pattern,
          normalizedPattern,
          isMatch: picomatch(normalizedPattern),
        };
      })
    : [];

  if (watchIgnorePatterns.length === 0) {
    debug("no watch ignore patterns");
  }

  const watcherCallback = (label: string) => (updatedPath: string) => {
    debug(`watcher: ${label}: ${updatedPath}`);

    // ugh, chokidar gives relative paths sometimes
    // and absolute paths other times
    if (!path.isAbsolute(updatedPath)) {
      updatedPath = path.resolve(process.cwd(), updatedPath);
    }

    if (watchIgnorePatterns.length > 0) {
      debug(`checking if ignored: ${updatedPath}`);
      const anyIgnored = watchIgnorePatterns.some(
        ({ pattern, normalizedPattern, isMatch }) => {
          const result = isMatch(updatedPath);
          debug(
            `checking ${pattern} (which was normalized to ${normalizedPattern}) against ${updatedPath}... ${result}`
          );
          return result;
        }
      );
      if (anyIgnored) return;
    }

    debug(`enqueueing run due to file change: ${label}: ${updatedPath}`);
    debouncedDoRun();
  };

  watcher.on("add", watcherCallback("add"));
  watcher.on("change", watcherCallback("change"));
  watcher.on("unlink", watcherCallback("unlink"));
  watcher.on("addDir", watcherCallback("addDir"));
  watcher.on("unlinkDir", watcherCallback("unlinkDir"));
  watcher.on("error", (error) => {
    debug(`watcher: error: ${util.inspect(error)}`);
  });

  let awaitingPattern = false;

  await new Promise<void>((resolve) => {
    process.stdin.on("data", (data) => {
      const stringData = data.toString("utf-8").replace(/\r/g, "");

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

          case "u\n":
          case "update\n": {
            const doIt = () => {
              updateSnapshotsOnNextRun = true;
              debouncedDoRun();
            };

            if (currentPass) {
              abortRequested = true;
              console.log("Canceling run...");
              currentPass.then(doIt);
            } else {
              doIt();
            }

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
            console.log(
              chalk`{bold update}: Run the tests and update all snapshots. {dim Shortcut: {bold u}}`
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

    process.on("SIGINT", () => resolve());
    process.on("SIGTERM", () => resolve());
  });
}
