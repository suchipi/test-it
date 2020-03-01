import chalk from "chalk";
import { diffLinesUnified } from "jest-diff";
import { SnapshotStateType } from "jest-snapshot";
import TestNameReporter from "./test-name-reporter";

const makeExpect = (
  filename: string,
  j: typeof import("@suchipi/jasmine-mini").default,
  snapshotState: SnapshotStateType
): typeof import("expect") => {
  const testNameReporter = new TestNameReporter();
  j.addReporter(testNameReporter);

  delete require.cache[require.resolve("expect")];
  const expect: typeof import("expect") = require("expect");

  const matchers = {
    toMatchSnapshot(received: any) {
      const testName = testNameReporter.getCurrentTestName();

      const result = snapshotState.match({
        testName,
        isInline: false,
        received,
        error: new Error(),
      });
      const actual = result.actual || "";
      const expected = result.expected || "";
      snapshotState.save();

      if (result.pass) {
        return {
          message: () => "",
          pass: true,
        };
      } else if (result.expected === undefined) {
        throw new Error(
          `Tried to write to a new snapshot in CI: '${filename}' '${result.key}'. Did you forget to commit your snapshots?`
        );
      } else {
        const summary = diffLinesUnified(
          expected.split("\n"),
          actual.split("\n"),
          {
            aAnnotation: "Snapshot",
            bAnnotation: "Received",
          }
        );

        return {
          message: () =>
            chalk.bold.red(
              `Expected value to match snapshot: '${result.key}'`
            ) +
            "\n\n" +
            summary,
          pass: false,
        };
      }
    },
  };

  expect.extend(matchers);

  return expect;
};

export default makeExpect;
