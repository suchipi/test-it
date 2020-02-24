import os from "os";
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

export async function runTests(inputConfig: Config): Promise<any> {
  const config = normalizeConfig(inputConfig);
  debug(`NormalizedConfig: ${util.inspect(config)}`);

  const j = new Jasmine();
  j.configureDefaultReporter({
    print: () => {},
  });

  if (config.seed != null) {
    j.seed(config.seed);
  }

  config.reporters.forEach((reporter) => j.addReporter(reporter));

  setupMatchers(expect, config);

  const windows = await Bluebird.map(
    config.testFiles,
    async (filename) => {
      if (!path.isAbsolute(filename)) {
        filename = path.join(process.cwd(), filename);
      }

      debug(`Opening window for '${filename}'`);

      const testWindow = await openWindow("about:blank", { show: false });

      const win: any = testWindow.window;

      win.nw = nw;
      win.global = win;
      win.process = process;
      win.regeneratorRuntime = regeneratorRuntime;
      win.Buffer = Buffer;

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

      const delegate = makeDelegate(config, win);
      const requireCache = {};

      testInterface.describe(path.relative(process.cwd(), filename), () => {
        debug(
          `Running test setup files: ${util.inspect(config.testSetupFiles)}`
        );
        config.testSetupFiles.forEach((testSetupFile) => {
          Module._load(testSetupFile, delegate, requireCache);
        });

        debug(`Running test code: '${filename}'`);
        Module._load(filename, delegate, requireCache);
      });

      return testWindow;
    },
    {
      concurrency: os.cpus().length,
    }
  );

  const results: any = await new Promise((resolve) => {
    j.onComplete(resolve);
    j.execute();
  });

  debug(`Run completed`);

  windows.forEach((win) => win.close(true));

  return results;
}
