import path from "path";
import chalk from "chalk";
import prettyFormat from "pretty-format";
import chai from "chai";
import { diffLinesUnified } from "jest-diff";
import chaiJestSnapshot from "chai-jest-snapshot";
import SnapshotReporter from "./snapshot-reporter";
import { NormalizedConfig } from "./config";
import makeDebug from "debug";

const debug = makeDebug("@test-it/core:commonjs-delegate.ts");

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

      let exists = false;
      try {
        debug(
          `Checking for snapshot '${snapshotName}' in '${snapshotFilename}'`
        );
        delete require.cache[require.resolve(snapshotFilename)];
        const snapshotContent = require(snapshotFilename);
        exists = snapshotContent[snapshotName] != null;
      } catch (err) {}

      if (config.updateSnapshots === "none" && exists === false) {
        throw new Error(
          `Tried to write to a new snapshot in CI: '${snapshotFilename}'. Did you forget to commit your snapshots?`
        );
      }

      let shouldUpdate = false;
      switch (config.updateSnapshots) {
        case "all": {
          shouldUpdate = true;
          break;
        }
        default: {
          shouldUpdate = !exists;
          break;
        }
      }

      try {
        chai
          .expect(received)
          // @ts-ignore
          .to.matchSnapshot(snapshotFilename, snapshotName, shouldUpdate);
      } catch (err) {
        let expected = "";
        try {
          delete require.cache[require.resolve(snapshotFilename)];
          expected = require(snapshotFilename)[snapshotName].trim();
        } catch (err) {}
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
