# Test-It

Test-It is a test framework that combines the best of node and the browser.

## The Problem

When running in a test framework built on top of node, like [Jest](https://jestjs.io/), you don't have access to real DOM APIs, like `window` and `document`.

Some test frameworks (Jest included) try to get around this by using [jsdom](https://github.com/jsdom/jsdom), but it has limitations; since there's no layout or rendering engine, you can't test things that rely on:

- What the page looks like (for eg. Visual Regression Testing)
- `.getBoundingClientRect()`
- `document.body.innerText`

This is usually solved by running the tests in a real browser, using something like [Karma](https://karma-runner.github.io/latest/index.html). But, that introduces other limitations:

- You can't use `require` in your tests, so your tests need to get compiled somehow
- You can't use `fs` in your tests, so you can't write [snapshots](https://jestjs.io/docs/en/snapshot-testing) or screenshots to disk.

If you want to do something that requires a real DOM as well as `require` or `fs`, then you have to write a complex server that ties everything together.

For example, if you want to render individual parts of your application to the DOM, and then perform Visual Regression Testing by taking screenshots of those components, you need to:

- Start a test "server", running in node
- Compile your tests so they can run in a browser (without `require`)
- Launch a browser, and make it open your compiled tests (via some http server)
- Have the tests communicate with the test server in order to use `fs` to write screenshots to disk

It's very complicated, and it's a lot to set up.

If there was a test framework that could run code with access to a Real DOM **and** node APIs, then we wouldn't need any of those things:

- No need for a test server that wraps `fs`, because you can access `fs` directly
- No need for test compilation/bundling, because you can use `require` right in your tests

**Test-It is that test framework.**

## The Solution

When you run your tests in Test-It, you have access to real DOM APIs _and_ all of node's APIs, including `require`.

Unlike test frameworks built on top of [jsdom](https://github.com/jsdom/jsdom), the DOM APIs here are real; your tests are running in a real Chromium browser.

But also, unlike test frameworks built on top [Karma](https://karma-runner.github.io/latest/index.html), the Node APIs here are _also_ real; your tests are running with full access to all node APIs (such as `require`, `fs`, etc).

Test-It gives you the best of both worlds.

## Installation

First, install `@test-it/core` and `@test-it/cli`:

```
npm install --save-dev @test-it/core @test-it/cli
```

Then, add the following to your `package.json`:

```json
"scripts": {
	"test-it": "test-it"
}
```

Then, run Test-It using npm:

```
npm run test-it
```

## Usage

By default, Test-It will run against any test files named like `*.test.js`.

To change this, you can pass glob strings to the `test-it` CLI:

```
npm run test-it -- './**/*.spec.js' '!**/node_modules/**'
```

You can also pass specific filenames:

```
npm run test-it -- './tests/first.spec.js' './tests/second.spec.js'
```

For more usage information run `npm run test-it -- --help`.
