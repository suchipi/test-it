import path from "path";
// @ts-ignore
import builtins from "builtins";
// @ts-ignore
import resolve from "resolve";
// @ts-ignore
import { NormalizedConfig } from "./config";
import makeDebug from "debug";

const debug = makeDebug("@test-it/core:commonjs-delegate.ts");

export function makeDelegate(config: NormalizedConfig, win: any) {
  const realRequire = require;
  const allBuiltins = new Set(builtins());

  const delegate = {
    resolve(id: string, fromFilePath: string) {
      debug(`resolving '${id}' from '${fromFilePath}'`);

      if (allBuiltins.has(id)) {
        return id;
      }

      return resolve.sync(id, {
        basedir: path.dirname(fromFilePath),
        preserveSymlinks: false,
        extensions: config.resolveExtensions,
      });
    },

    read(filepath: string) {
      if (allBuiltins.has(filepath)) {
        return "";
      }

      debug(`Loading '${filepath}'`);
      const code = config.loader(filepath);

      debug(`Loaded '${filepath}'`);
      return code;
    },

    run(
      code: string,
      moduleEnv: {
        exports: any;
        require: any;
        module: any;
        __filename: string;
        __dirname: string;
      },
      filepath: string
    ) {
      debug(`Running '${code}'`);

      if (allBuiltins.has(filepath)) {
        moduleEnv.exports = moduleEnv.module.exports = realRequire(filepath);
        return;
      }

      const wrapper = win.eval(
        "(function (exports, require, module, __filename, __dirname) { " +
          code +
          "\n})\n" +
          `//# sourceURL=${filepath}\n`
      );

      wrapper(
        moduleEnv.exports,
        moduleEnv.require,
        moduleEnv.module,
        moduleEnv.__filename,
        moduleEnv.__dirname
      );
    },
  };

  return delegate;
}
