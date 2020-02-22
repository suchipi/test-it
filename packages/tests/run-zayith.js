const path = require("path");
const { spawn } = require("first-base");

const zayith = (...args) =>
  spawn(path.join(__dirname, "../../node_modules/.bin/zayith"), [
    "--seed",
    "1234",
    ...args,
  ]);

module.exports = async function runZayith(args, opts = {}) {
  const run = zayith(...args);
  await run.completion;
  expect(run.result.error).toBe(false);

  return run.result;
};
