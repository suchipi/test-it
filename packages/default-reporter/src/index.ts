import chalk from "chalk";
import util from "util";
import makeDebug from "debug";

const debug = makeDebug("@test-it/default-reporter:index.ts");

const lightRed = "#f14c4c";
const lightGreen = "#23d18b";
const lightYellow = "#f5f543";

function indent(str: string, amount: number) {
  const indentAmount = amount * 2; // 2 spaces
  return str
    .split("\n")
    .map((line) => " ".repeat(indentAmount) + line)
    .join("\n");
}

function printResult(
  result: jasmine.CustomReporterResult & { kind: "spec" | "suite" }
) {
  if (result.kind === "suite") return;

  let message = "";
  if (result.status === "passed") {
    message += chalk.green("✓ " + result.fullName);
  } else if (result.status === "failed") {
    message += chalk.red("✕ " + result.fullName);
  } else {
    message += chalk.yellow("○ " + result.fullName);
  }

  console.log(message);
}

function formatError(message: string, stack: string) {
  let error = message + "\n" + stack;
  if (message.startsWith("SyntaxError") && message.includes("^")) {
    error = message;
  }

  return error
    .split("\n")
    .map((line) => {
      let output = line;

      // Errors from expect show the matcher hint in gray. Detect that and
      // print those errors nicely.
      if (line.indexOf("Error: \u001b[2m") === 0) {
        output = line.replace(/^Error: /, "") + "\n";
      }

      // Make file locations blue
      output = output.replace(/(at .* \()([^)]+)/g, "$1" + chalk.blue("$2"));

      return output;
    })
    .join("\n")
    .trim();
}

function summarizeFailingResult(result: jasmine.CustomReporterResult) {
  console.log(chalk.hex(lightRed)(chalk.bold("● " + result.fullName)) + "\n");

  if (result.failedExpectations) {
    result.failedExpectations.forEach((failedExpectation) => {
      const formattedErrorMessage = formatError(
        failedExpectation.message,
        failedExpectation.stack
      );
      console.log(indent(formattedErrorMessage, 1) + "\n");
    });
  }
}

function specCountSummary(
  results: Array<jasmine.CustomReporterResult & { kind: "spec" | "suite" }>
) {
  const numFailed = results.filter((result) => result.status === "failed")
    .length;
  const numSuccess = results.filter(
    (result) => result.status === "passed" && result.kind === "spec"
  ).length;
  const numSkipped = results.filter((result) => result.status === "pending")
    .length;

  let summaryNotes: Array<string> = [];
  if (numFailed > 0) {
    summaryNotes.push(chalk.bold(chalk.hex(lightRed)(`${numFailed} failed`)));
  }
  if (numSkipped > 0) {
    summaryNotes.push(
      chalk.bold(chalk.hex(lightYellow)(`${numSkipped} skipped`))
    );
  }
  if (numSuccess > 0) {
    summaryNotes.push(
      chalk.bold(chalk.hex(lightGreen)(`${numSuccess} passed`))
    );
  }
  summaryNotes.push(`${numFailed + numSkipped + numSuccess} total`);

  return summaryNotes.join(", ");
}

class Reporter implements jasmine.CustomReporter {
  results: Array<
    jasmine.CustomReporterResult & { kind: "suite" | "spec" }
  > = [];

  jasmineStarted(suiteInfo: jasmine.SuiteInfo) {
    debug(`reporter.jasmineStarted(${util.inspect(suiteInfo)});`);

    this.results = [];
  }

  suiteStarted(result: jasmine.CustomReporterResult) {
    debug(`reporter.suiteStarted(${util.inspect(result)});`);

    printResult({ ...result, kind: "suite" });
  }

  specStarted(result: jasmine.CustomReporterResult) {
    debug(`reporter.specStarted(${util.inspect(result)});`);
  }

  specDone(result: jasmine.CustomReporterResult) {
    debug(`reporter.specDone(${util.inspect(result)});`);

    printResult({ ...result, kind: "spec" });

    this.results.push({ ...result, kind: "spec" });
  }

  suiteDone(result: jasmine.CustomReporterResult) {
    debug(`reporter.suiteDone(${util.inspect(result)});`);

    if (result.status === "failed") {
      printResult({
        ...result,
        description: "error in describe or before/after callback",
        kind: "spec",
      });
    }

    this.results.push({ ...result, kind: "suite" });
  }

  jasmineDone(results: jasmine.RunDetails) {
    debug(`reporter.suiteDone(${util.inspect(results)});`);

    if (this.results.length > 0) {
      process.stdout.write("\n");
    }

    const failing = this.results.filter((result) => result.status === "failed");
    failing.forEach(summarizeFailingResult);

    console.log(chalk.bold(specCountSummary(this.results)));
  }
}

export default Reporter;
