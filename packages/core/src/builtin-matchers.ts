import path from "path";
import chalk from "chalk";
import prettyFormat from "pretty-format";
import chai from "chai";
import { diffLinesUnified } from "jest-diff";
// @ts-ignore
import chaiJestSnapshot from "chai-jest-snapshot";
import SnapshotReporter from "./snapshot-reporter";
import { NormalizedConfig } from "./config";

chai.use(chaiJestSnapshot);

function serializeLikeSnapshot(value: any): string {
  const {
    DOMCollection,
    DOMElement,
    Immutable,
    ReactElement,
    ReactTestComponent,
    AsymmetricMatcher,
  } = prettyFormat.plugins;

  const plugins = [
    ReactTestComponent,
    ReactElement,
    DOMElement,
    DOMCollection,
    Immutable,
    AsymmetricMatcher,
  ];

  return prettyFormat(value, { plugins });
}

export const setupMatchers = (expect: any, config: NormalizedConfig) => {
  const matchers = {
    toMatchSnapshot(received: any) {
      const snapshotNumber = SnapshotReporter.getSnapshotNumber();

      const snapshotFilename = path.join(
        process.cwd(),
        SnapshotReporter.getCurrentTestFile() + ".snap"
      );
      let snapshotName = SnapshotReporter.getCurrentTestName();
      if (snapshotNumber > 1) {
        snapshotName += " " + snapshotNumber;
      }

      try {
        chai
          .expect(received)
          // @ts-ignore
          .to.matchSnapshot(
            snapshotFilename,
            snapshotName,
            config.updateSnapshots
          );
      } catch (err) {
        const expected = require(snapshotFilename)[snapshotName].trim();
        const actual = serializeLikeSnapshot(received).trim();

        const summary = diffLinesUnified(
          expected.split("\n"),
          actual.split("\n"),
          {
            aAnnotation: "Snapshot",
            bAnnotation: "Received",
          }
        );

        return {
          message: () => chalk.bold.red(err.message) + "\n\n" + summary,
          pass: false,
        };
      }

      return {
        message: () => "",
        pass: true,
      };
    },
  };

  expect.extend(matchers);
};
