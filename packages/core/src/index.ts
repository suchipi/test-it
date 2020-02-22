import path from "path";
import util from "util";
import expect from "expect";
// @ts-ignore
import Jasmine from "@suchipi/jasmine-mini";
import { PartialConfig, normalizeConfig } from "./config";
// @ts-ignore
import { requireMain } from "commonjs-standalone";
import { makeDelegate } from "./commonjs-delegate";
import makeDebug from "debug";

const debug = makeDebug("@zayith/core:index.ts");

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
    win.process = process;

    const testInterface = j.getInterface();
    Object.assign(win, testInterface);

    win.expect = expect;
    win.test = win.it;
    win.it.only = win.fit;
    win.test.only = win.fit;
    win.describe.only = win.fdescribe;
    win.it.skip = win.xit;
    win.test.skip = win.xit;
    win.describe.skip = win.xdescribe;

    const delegate = makeDelegate(config, win);

    testInterface.describe(path.relative(process.cwd(), filename), () => {
      requireMain(filename, delegate);
    });
  }

  const results: any = await new Promise((resolve) => {
    j.onComplete(resolve);
    j.execute();
  });

  debug(`Run completed`);

  return results;
}
