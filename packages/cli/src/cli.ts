import fs from "fs";
import path from "path";
import chalk from "chalk";
import child_process from "child_process";
import makeDebug from "debug";

const debug = makeDebug("@zayith/cli:cli.ts");

const nodeNwPkgPath = require.resolve("node-nw/package.json");
const nodeNwDirectoryPath = path.dirname(nodeNwPkgPath);

const nodeNwPkg = JSON.parse(fs.readFileSync(nodeNwPkgPath, "utf-8"));

let nodeNwBin: string;
if (typeof nodeNwPkg.bin === "string") {
  nodeNwBin = path.join(nodeNwDirectoryPath, nodeNwPkg.bin);
} else {
  nodeNwBin = path.join(nodeNwDirectoryPath, nodeNwPkg.bin["node-nw"]);
}

debug(`Using node-nw bin at '${nodeNwBin}'`);

const child = child_process.spawn(
  "node",
  [
    nodeNwBin,
    path.join(__dirname, "index.js"),
    ...process.argv
      .slice(2)
      // Hack: node-nw swallows the `--help` arg, so we need to change it to something else.
      .map((arg) => (arg === "--help" ? "--halp" : arg))
      // Hack: node-nw swallows the `--version` arg, so we need to change it to something else.
      .map((arg) => (arg === "--version" ? "--varsion" : arg)),
  ],
  {
    cwd: process.cwd(),
  }
);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
process.stdin.pipe(child.stdin);

child.on("error", (err) => {
  debug(`Child process errored: ${err.stack || err}`);

  console.error(chalk.red(err.stack || err));
  process.exitCode = 2;
});

child.on("exit", (code, signal) => {
  debug(`Child process exited; code: ${code}, signal: ${signal}`);

  process.exit(code || 0);
});
