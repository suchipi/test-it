import fs from "fs";
import path from "path";
import util from "util";
import mkdirp from "mkdirp";
import chalk from "chalk";
import isBuffer from "is-buffer";
import { diffLinesUnified } from "jest-diff";
import { SnapshotStateType } from "jest-snapshot";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import TestNameReporter from "./test-name-reporter";
import { NormalizedConfig } from "./config";

const makeExpect = (
  filename: string,
  j: typeof import("@suchipi/jasmine-mini").default,
  snapshotState: SnapshotStateType,
  config: NormalizedConfig
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

    toMatchInlineSnapshot() {
      throw new Error(
        "Sorry, inline snapshots are not yet supported. Use `toMatchSnapshot` instead."
      );
    },

    toMatchImageSnapshot(received: Buffer) {
      if (!isBuffer(received)) {
        throw new Error(
          `toMatchImageSnapshot must be used with a buffer of png data, but instead, it was used with: ${util.inspect(
            received
          )}`
        );
      }

      const testName = testNameReporter.getCurrentTestName();
      const testFileSnapshotFolder = path.join(
        path.dirname(filename),
        "image-snapshots",
        path.basename(filename, path.extname(filename))
      );

      const snapshotExpectedFile = path.join(
        testFileSnapshotFolder,
        testName + ".png"
      );
      const snapshotActualFile = path.join(
        testFileSnapshotFolder,
        testName + ".actual.png"
      );
      const snapshotDiffFile = path.join(
        testFileSnapshotFolder,
        testName + ".diff.png"
      );

      mkdirp.sync(testFileSnapshotFolder);

      if (fs.existsSync(snapshotActualFile)) {
        fs.unlinkSync(snapshotActualFile);
      }

      if (fs.existsSync(snapshotDiffFile)) {
        fs.unlinkSync(snapshotDiffFile);
      }

      if (config.updateSnapshots === "none") {
        throw new Error(
          `Tried to write to a new image snapshot in CI: '${snapshotExpectedFile}'. Did you forget to commit your snapshots?`
        );
      } else if (config.updateSnapshots === "all") {
        fs.writeFileSync(snapshotExpectedFile, received);
        return {
          message: () => "",
          pass: true,
        };
      } else if (config.updateSnapshots === "new") {
        if (fs.existsSync(snapshotExpectedFile)) {
          const actual = received;
          const expected = fs.readFileSync(snapshotExpectedFile);

          const actualPng = PNG.sync.read(actual);
          const expectedPng = PNG.sync.read(expected);

          const { width, height } = expectedPng;
          const diff = new PNG({ width, height });

          let matchError;
          let numChangedPixels = 0;
          try {
            if (
              actualPng.width !== expectedPng.width ||
              actualPng.height !== expectedPng.height
            ) {
              throw new Error(
                `The provided image has different dimensions from the snapshot.\nSnapshot dimensions: ${expectedPng.width}x${expectedPng.height}\nActual dimensions: ${actualPng.width}x${actualPng.height}`
              );
            }

            numChangedPixels = pixelmatch(
              expectedPng.data,
              actualPng.data,
              diff.data,
              width,
              height
            );
          } catch (err) {
            matchError = err;
          }

          if (matchError || numChangedPixels > 0) {
            fs.writeFileSync(snapshotActualFile, PNG.sync.write(actualPng));
            if (!matchError) {
              fs.writeFileSync(snapshotDiffFile, PNG.sync.write(diff));
            }

            return {
              message: () =>
                `Expected image to match snapshot, but it did not: '${path.relative(
                  process.cwd(),
                  snapshotExpectedFile
                )}'. ${
                  matchError
                    ? matchError.toString()
                    : `Check the diff at '${path.relative(
                        process.cwd(),
                        snapshotDiffFile
                      )}'`
                }`,
              pass: false,
            };
          }
        } else {
          fs.writeFileSync(snapshotExpectedFile, received);
        }
      }

      return {
        message: () => "",
        pass: true,
      };
    },
  };

  expect.extend(matchers);

  return expect;
};

export default makeExpect;
