import path from "path";
import util from "util";
import expect from "expect";
// @ts-ignore
import Jasmine from "@suchipi/jasmine-mini";
import { PartialConfig, normalizeConfig } from "./config";
// @ts-ignore
import { Module } from "commonjs-standalone";
import { makeDelegate } from "./commonjs-delegate";
import makeDebug from "debug";
// @ts-ignore
import regeneratorRuntime from "regenerator-runtime";
import { setupMatchers } from "./builtin-matchers";

const debug = makeDebug("@test-it/core:index.ts");

export type Config = PartialConfig;

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

  for (let filename of config.testFiles) {
    if (!path.isAbsolute(filename)) {
      filename = path.join(process.cwd(), filename);
    }

    debug(`Creating iframe for '${filename}'`);

    const win: any = await new Promise((resolve) => {
      const frame = document.createElement("iframe");
      frame.onload = () => {
        resolve(frame.contentDocument?.defaultView);
      };
      frame.src = "about:blank";
      document.body.appendChild(frame);
    });

    win.document.innerHTML = "";

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
      debug(`Running test setup files: ${util.inspect(config.testSetupFiles)}`);
      config.testSetupFiles.forEach((testSetupFile) => {
        Module._load(testSetupFile, delegate, requireCache);
      });

      debug(`Running test code: '${filename}'`);
      Module._load(filename, delegate, requireCache);
    });
  }

  const results: any = await new Promise((resolve) => {
    j.onComplete(resolve);
    j.execute();
  });

  debug(`Run completed`);

  return results;
}
