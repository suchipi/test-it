import util from "util";
import expect from "expect";
// @ts-ignore
import Jasmine from "@suchipi/jasmine-mini";
import { PartialConfig, normalizeConfig } from "./config";
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

  const windows = [];
  for (const filename of config.testFiles) {
    debug(`Creating window for '${filename}'`);

    const win: nw.Window = await new Promise((resolve) => {
      nw.Window.open("", { show: false }, resolve);
    });

    win.window.document.innerHTML = "";

    Object.assign(win.window, j.getInterface());
    win.window.expect = expect;

    debug(`Loading '${filename}'`);
    const code = await config.loader(filename);

    debug(`Running code for '${filename}'`);
    win.eval(null, code);

    windows.push(win);
  }

  const results: any = await new Promise((resolve) => {
    j.onComplete(resolve);
    j.execute();
  });

  debug(`Run completed; closing all windows`);

  windows.forEach((win) => win.close(true));

  return results;
}
