import path from "path";
import util from "util";
import Bluebird from "bluebird";
import expect from "expect";
import Jasmine from "@suchipi/jasmine-mini";
import { PartialConfig, normalizeConfig } from "./config";
import { Module } from "commonjs-standalone";
import { makeDelegate } from "./commonjs-delegate";
import makeDebug from "debug";
import regeneratorRuntime from "regenerator-runtime";
import { setupMatchers } from "./builtin-matchers";

const debug = makeDebug("@test-it/core:index.ts");

export type Config = PartialConfig;

function openWindow(url: string, options: nw.IWindowOptions) {
  return new Promise<nw.Window>((resolve) =>
    nw.Window.open(url, options, resolve)
  );
}

const REAL_JASMINE_DONE = Symbol("REAL_JASMINE_DONE");

export async function runTests(
  inputConfig: Config
): Promise<"failed" | "passed" | "canceled"> {
  const config = normalizeConfig(inputConfig);
  debug(`NormalizedConfig: ${util.inspect(config)}`);

  setupMatchers(expect, config);

  let hasReportedStart = false;
  let lastRunDetails: null | jasmine.RunDetails = null;

  config.reporters.forEach((reporter) => {
    const realJasmineStarted = reporter.jasmineStarted || (() => {});
    reporter.jasmineStarted = (...args) => {
      if (!hasReportedStart) {
        realJasmineStarted.call(reporter, ...args);
        hasReportedStart = true;
      }
    };

    reporter[REAL_JASMINE_DONE] = reporter.jasmineDone;
    reporter.jasmineDone = (runDetails) => {
      lastRunDetails = runDetails;
    };
  });

  const results = await Bluebird.map(
    config.testFiles,
    async (filename) => {
      if (config.shouldAbort()) return { overallStatus: "canceled" };

      if (!path.isAbsolute(filename)) {
        filename = path.join(process.cwd(), filename);
      }
      const relativeFilename = path.relative(process.cwd(), filename);

      debug(`Opening window for '${filename}'`);

      const j = new Jasmine();
      j.configureDefaultReporter({
        print: () => {},
      });

      if (config.seed != null) {
        j.seed(config.seed);
      }

      config.reporters.forEach((reporter) => j.addReporter(reporter));

      const testWindow = await openWindow("about:blank", { show: false });

      const win: any = testWindow.window;

      win.nw = nw;
      win.global = win;
      win.process = process;
      win.regeneratorRuntime = regeneratorRuntime;
      win.Buffer = Buffer;

      const originalConsole = win.console;
      win.console = {
        ...originalConsole,
        assert: (condition: boolean, ...args: Array<any>) => {
          console.assert(
            condition,
            `console.assert (${relativeFilename}):`,
            ...args
          );
          originalConsole.assert(condition, ...args);
        },
        dir: (object: any) => {
          console.log(
            `console.dir (${relativeFilename}):\n${util.inspect(object)}`
          );
          originalConsole.dir(object);
        },
        error: (...args: Array<any>) => {
          console.error(`console.error (${relativeFilename}):`, ...args);
          originalConsole.error(...args);
        },
        info: (...args: Array<any>) => {
          console.info(`console.info (${relativeFilename}):`, ...args);
          originalConsole.info(...args);
        },
        log: (...args: Array<any>) => {
          console.log(`console.log (${relativeFilename}):`, ...args);
          originalConsole.log(...args);
        },
        warn: (...args: Array<any>) => {
          console.warn(`console.warn (${relativeFilename}):`, ...args);
          originalConsole.warn(...args);
        },
        time: (label: string) => {
          console.time(`console.time (${relativeFilename}): ${label}`);
          originalConsole.time(label);
        },
        timeEnd: (label: string) => {
          console.timeEnd(`console.timeEnd (${relativeFilename}): ${label}`);
          originalConsole.timeEnd(label);
        },
      };

      win.TestIt = {
        async captureScreenshot(options = { fullsize: true }) {
          const captureScreenshot = util.promisify(
            // @ts-ignore
            testWindow.captureScreenshot.bind(testWindow)
          );

          // Seems to be a bug in NW.js here; captureScreenshot
          // never resolves unless the page is visible.
          testWindow.show(true);
          const base64 = await captureScreenshot(options);
          testWindow.show(false);

          return Buffer.from(base64, "base64");
        },
      };

      const testInterface = j.getInterface();
      Object.assign(win, testInterface);

      win.expect = expect;

      // jest compat
      win.test = win.it;
      win.it.only = win.fit;
      win.test.only = win.fit;
      win.describe.only = win.fdescribe;
      win.it.skip = win.xit;
      win.test.skip = win.xit;
      win.describe.skip = win.xdescribe;

      // mocha compat
      win.before = win.beforeAll;
      win.after = win.afterAll;

      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      win.debug = (name: string, cb: Function) => {
        if (cb.length === 1) {
          win.it(
            name,
            async (done: Function) => {
              testWindow.show(true);
              testWindow.showDevTools(undefined, async () => {
                // Racing the amount of time it takes devtools to connect...
                await sleep(1500);

                win.eval(
                  [
                    `(function debug(testCode /* ${name} */, done) {`,
                    `  // Your test code hasn't run yet. `,
                    `  // To run it, either:`,
                    `  //`,
                    `  // - Press the blue 'Resume script execution' button in the right pane,`,
                    `  // OR`,
                    `  // - Press the gray 'Step into next function call' button twice.`,
                    `  //`,
                    `  // When you're done debugging, close the browser window to resume your tests.`,
                    `  debugger;`,
                    `  testCode(done);`,
                    `})`,
                  ].join("\n")
                )(cb, () => {
                  // `done` is a no-op when debugging. Close the browser window to end the test.
                });

                testWindow.on("close", () => done());
              });
            },
            // Set the jasmine async timeout for this test to a really big number.
            2147483647 // If we pass a larger number, it gets coerced to 1
          );
        } else {
          win.it(
            name,
            async () => {
              testWindow.show(true);
              await new Promise((resolve) => {
                testWindow.showDevTools(undefined, resolve);
              });

              // Racing the amount of time it takes devtools to connect...
              await sleep(1500);

              const result = win.eval(
                [
                  `(function debug(testCode /* ${name} */) {`,
                  `  // Your test code hasn't run yet. `,
                  `  // To run it, either:`,
                  `  //`,
                  `  // - Press the blue 'Resume script execution' button in the right pane,`,
                  `  // OR`,
                  `  // - Press the gray 'Step into next function call' button twice.`,
                  `  //`,
                  `  // When you're done debugging, close the browser window to resume your tests.`,
                  `  debugger;`,
                  `  testCode();`,
                  `})`,
                ].join("\n")
              )(cb);

              await result;

              await new Promise((resolve) => {
                testWindow.on("close", resolve);
              });
            },
            // Set the jasmine async timeout for this test to a really big number.
            2147483647 // If we pass a larger number, it gets coerced to 1
          );
        }
      };

      const delegate = makeDelegate(config, win);
      const requireCache = {};

      testInterface.describe(relativeFilename, () => {
        debug(
          `Running test setup files: ${util.inspect(config.testSetupFiles)}`
        );
        config.testSetupFiles.forEach((testSetupFile) => {
          Module._load(testSetupFile, delegate, requireCache);
        });

        debug(`Running test code: '${filename}'`);
        Module._load(filename, delegate, requireCache);
      });

      const results: { overallStatus: string } = await new Promise(
        (resolve) => {
          j.onComplete(resolve);
          j.execute();
        }
      );

      testWindow.close(true);

      return results;
    },
    {
      // TODO: the snapshot reporter messes stuff up when we run tests concurrently.
      // We need to switch to a more robust system, like jest's snapshot state.
      concurrency: 1,
    }
  );

  config.reporters.forEach((reporter) => {
    if (reporter[REAL_JASMINE_DONE]) {
      reporter[REAL_JASMINE_DONE](lastRunDetails);
    }
  });

  debug(`Run completed`);

  const overallStatus = results.some(
    (result) => result.overallStatus === "failed"
  )
    ? "failed"
    : results.some((result) => result.overallStatus === "canceled")
    ? "canceled"
    : "passed";

  return overallStatus;
}
