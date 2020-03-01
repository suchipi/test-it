import util from "util";
import makeDebug from "debug";

const debug = makeDebug("@test-it/core:test-name-reporter.ts");

export default class TestNameReporter implements jasmine.CustomReporter {
  stack: Array<string> = [];

  getCurrentTestFile() {
    return this.stack[0];
  }

  getCurrentTestName() {
    return this.stack.slice(1, this.stack.length).join(" ");
  }

  jasmineStarted(_suiteInfo: jasmine.SuiteInfo) {
    this.stack = [];
    debug(`stack: ${util.inspect(this.stack)}`);
  }

  suiteStarted(result: jasmine.CustomReporterResult) {
    this.stack.push(result.description);
    debug(`stack: ${util.inspect(this.stack)}`);
  }

  specStarted?(result: jasmine.CustomReporterResult) {
    this.stack.push(result.description);
    debug(`stack: ${util.inspect(this.stack)}`);
  }

  specDone(_result: jasmine.CustomReporterResult) {
    this.stack.pop();
    debug(`stack: ${util.inspect(this.stack)}`);
  }

  suiteDone(_result: jasmine.CustomReporterResult) {
    this.stack.pop();
    debug(`stack: ${util.inspect(this.stack)}`);
  }

  jasmineDone(_results: jasmine.RunDetails) {
    this.stack = [];
  }
}
