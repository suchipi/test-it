const stack: Array<string> = [];
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
  }

  suiteStarted(result: jasmine.CustomReporterResult) {
    currentSnapshotNumber = 1;
    stack.push(result.description);
  }

  specStarted?(result: jasmine.CustomReporterResult) {
    currentSnapshotNumber = 1;
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
