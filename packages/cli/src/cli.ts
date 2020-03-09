#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import child_process from "child_process";
import makeDebug from "debug";

const debug = makeDebug("@test-it/cli:cli.ts");

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

const mappedArgs = process.argv
  .slice(2)
  // Hack: node-nw swallows the `--help` arg, so we need to change it to something else.
  .map((arg) => (arg === "--help" ? "--halp" : arg))
  // Hack: node-nw swallows the `--version` arg, so we need to change it to something else.
  .map((arg) => (arg === "--version" ? "--varsion" : arg));

const child = child_process.spawn(
  "node",
  [
    nodeNwBin,
    path.join(__dirname, "index.js"),
    ...mappedArgs,

    // Default DPI settings so image snapshots are consistent across devices
    // (these flags get forwarded to chrome). But, allow the user to override them
    ...(mappedArgs.some((arg) => arg.match(/--high-dpi-support/))
      ? []
      : ["--high-dpi-support=1"]),
    ...(mappedArgs.some((arg) => arg.match(/--force-device-scale-factor/))
      ? []
      : ["--force-device-scale-factor=1"]),
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      // TODO: node-nw isn't forwarding color detection properly
      FORCE_COLOR: "3",
    },
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

process.on("SIGINT", () => {
  child.kill("SIGINT");
});

process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});
