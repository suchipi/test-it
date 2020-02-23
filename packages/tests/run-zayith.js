const path = require("path");
const { spawn } = require("first-base");

const test-it = (args, opts) =>
  spawn(
    path.join(__dirname, "../../node_modules/.bin/test-it"),
    ["--seed", "1234", ...args],
    opts
  );

module.exports = async function runTestIt(args, opts = {}) {
  const run = test-it(args, opts);
  await run.completion;
  expect(run.result.error).toBe(false);

  return run.result;
};
