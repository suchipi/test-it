import util from "util";
import makeDebug from "debug";

const debug = makeDebug("@test-it/core:snapshot-reporter.ts");

let stack: Array<string> = [];
let currentSnapshotNumber = 1;

export default class SnapshotReporter implements jasmine.CustomReporter {
  static getCurrentTestFile() {
    return stack[0];
  }

  static getCurrentTestName() {
    return stack.slice(1, stack.length).join(" ");
  }

  static getSnapshotNumber() {
    const ret = currentSnapshotNumber;
    currentSnapshotNumber++;
    return ret;
  }

  jasmineStarted(_suiteInfo: jasmine.SuiteInfo) {
    currentSnapshotNumber = 1;
    stack = [];
    debug(`Stack: ${util.inspect(stack)}`);
  }

  suiteStarted(result: jasmine.CustomReporterResult) {
    currentSnapshotNumber = 1;
    stack.push(result.description);
    debug(`Stack: ${util.inspect(stack)}`);
  }

  specStarted?(result: jasmine.CustomReporterResult) {
    currentSnapshotNumber = 1;
    stack.push(result.description);
    debug(`Stack: ${util.inspect(stack)}`);
  }

  specDone(_result: jasmine.CustomReporterResult) {
    stack.pop();
    debug(`Stack: ${util.inspect(stack)}`);
  }

  suiteDone(_result: jasmine.CustomReporterResult) {
    stack.pop();
    debug(`Stack: ${util.inspect(stack)}`);
  }

  jasmineDone(_results: jasmine.RunDetails) {}
}
