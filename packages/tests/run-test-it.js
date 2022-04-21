const path = require("path");
const { spawn } = require("first-base");

const rootDir = path.resolve(__dirname, "../..");

const testIt = (args, opts) =>
  spawn(
    path.resolve(__dirname, "../cli/dist/cli.js"),
    ["--seed", "1234", ...args],
    opts
  );

module.exports = async function runTestIt(args, opts = {}) {
  const run = testIt(args, opts);
  await run.completion;
  run.result.stdout = run.result.stdout.replace(
    new RegExp(rootDir, "g"),
    "<rootDir>"
  );
  run.result.stderr = run.result.stderr.replace(
    new RegExp(rootDir, "g"),
    "<rootDir>"
  );
  expect(run.result.error).toBe(false);

  return run.result;
};
