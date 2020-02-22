const stack: Array<string> = [];

export default class TestNameReporter implements jasmine.CustomReporter {
  static get currentTestFile() {
    return stack[0];
  }

  static get currentTestName() {
    return stack.slice(1, stack.length).join(" ");
  }

  jasmineStarted(_suiteInfo: jasmine.SuiteInfo) {}

  suiteStarted(result: jasmine.CustomReporterResult) {
    stack.push(result.description);
  }

  specStarted?(result: jasmine.CustomReporterResult) {
    stack.push(result.description);
  }

  specDone(_result: jasmine.CustomReporterResult) {
    stack.pop();
  }

  suiteDone(_result: jasmine.CustomReporterResult) {
    stack.pop();
  }

  jasmineDone(_results: jasmine.RunDetails) {}
}
