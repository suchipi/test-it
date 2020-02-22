import path from "path";
import util from "util";
import expect from "expect";
// @ts-ignore
import Jasmine from "@suchipi/jasmine-mini";
import { PartialConfig, normalizeConfig } from "./config";
// @ts-ignore
import makeModuleEnv from "make-module-env";
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
    const env = makeModuleEnv(filename);
    Object.assign(win, env);

    Object.assign(win, j.getInterface());
    win.expect = expect;

    debug(`Loading '${filename}'`);
    const code = await config.loader(filename);

    debug(`Running code for '${filename}'`);
    win.eval(code);
  }

  const results: any = await new Promise((resolve) => {
    j.onComplete(resolve);
    j.execute();
  });

  debug(`Run completed`);

  return results;
}
