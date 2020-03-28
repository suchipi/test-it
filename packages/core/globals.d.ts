// @ts-ignore
type Obj = Record<string, any>;

interface Constructable {
  new (...args: Array<unknown>): unknown;
}

declare namespace TestItExpect {
  export interface Matchers<R> {
    /**
     * Ensures the last call to a mock function was provided specific args.
     */
    lastCalledWith(...args: Array<unknown>): R;
    /**
     * Ensure that the last call to a mock function has returned a specified value.
     */
    lastReturnedWith(value: unknown): R;
    /**
     * If you know how to test something, `.not` lets you test its opposite.
     */
    not: Matchers<R>;
    /**
     * Ensure that a mock function is called with specific arguments on an Nth call.
     */
    nthCalledWith(nthCall: number, ...args: Array<unknown>): R;
    /**
     * Ensure that the nth call to a mock function has returned a specified value.
     */
    nthReturnedWith(n: number, value: unknown): R;
    /**
     * Use resolves to unwrap the value of a fulfilled promise so any other
     * matcher can be chained. If the promise is rejected the assertion fails.
     */
    resolves: Matchers<Promise<R>>;
    /**
     * Unwraps the reason of a rejected promise so any other matcher can be chained.
     * If the promise is fulfilled the assertion fails.
     */
    rejects: Matchers<Promise<R>>;
    /**
     * Checks that a value is what you expect. It uses `===` to check strict equality.
     * Don't use `toBe` with floating-point numbers.
     */
    toBe(expected: unknown): R;
    /**
     * Ensures that a mock function is called.
     */
    toBeCalled(): R;
    /**
     * Ensures that a mock function is called an exact number of times.
     */
    toBeCalledTimes(expected: number): R;
    /**
     * Ensure that a mock function is called with specific arguments.
     */
    toBeCalledWith(...args: Array<unknown>): R;
    /**
     * Using exact equality with floating point numbers is a bad idea.
     * Rounding means that intuitive things fail.
     * The default for numDigits is 2.
     */
    toBeCloseTo(expected: number, numDigits?: number): R;
    /**
     * Ensure that a variable is not undefined.
     */
    toBeDefined(): R;
    /**
     * When you don't care what a value is, you just want to
     * ensure a value is false in a boolean context.
     */
    toBeFalsy(): R;
    /**
     * For comparing floating point numbers.
     */
    toBeGreaterThan(expected: number | bigint): R;
    /**
     * For comparing floating point numbers.
     */
    toBeGreaterThanOrEqual(expected: number | bigint): R;
    /**
     * Ensure that an object is an instance of a class.
     * This matcher uses `instanceof` underneath.
     */
    toBeInstanceOf(expected: Function): R;
    /**
     * For comparing floating point numbers.
     */
    toBeLessThan(expected: number | bigint): R;
    /**
     * For comparing floating point numbers.
     */
    toBeLessThanOrEqual(expected: number | bigint): R;
    /**
     * This is the same as `.toBe(null)` but the error messages are a bit nicer.
     * So use `.toBeNull()` when you want to check that something is null.
     */
    toBeNull(): R;
    /**
     * Use when you don't care what a value is, you just want to ensure a value
     * is true in a boolean context. In JavaScript, there are six falsy values:
     * `false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy.
     */
    toBeTruthy(): R;
    /**
     * Used to check that a variable is undefined.
     */
    toBeUndefined(): R;
    /**
     * Used to check that a variable is NaN.
     */
    toBeNaN(): R;
    /**
     * Used when you want to check that an item is in a list.
     * For testing the items in the list, this uses `===`, a strict equality check.
     */
    toContain(expected: unknown): R;
    /**
     * Used when you want to check that an item is in a list.
     * For testing the items in the list, this  matcher recursively checks the
     * equality of all fields, rather than checking for object identity.
     */
    toContainEqual(expected: unknown): R;
    /**
     * Used when you want to check that two objects have the same value.
     * This matcher recursively checks the equality of all fields, rather than checking for object identity.
     */
    toEqual(expected: unknown): R;
    /**
     * Ensures that a mock function is called.
     */
    toHaveBeenCalled(): R;
    /**
     * Ensures that a mock function is called an exact number of times.
     */
    toHaveBeenCalledTimes(expected: number): R;
    /**
     * Ensure that a mock function is called with specific arguments.
     */
    toHaveBeenCalledWith(...args: Array<unknown>): R;
    /**
     * Ensure that a mock function is called with specific arguments on an Nth call.
     */
    toHaveBeenNthCalledWith(nthCall: number, ...args: Array<unknown>): R;
    /**
     * If you have a mock function, you can use `.toHaveBeenLastCalledWith`
     * to test what arguments it was last called with.
     */
    toHaveBeenLastCalledWith(...args: Array<unknown>): R;
    /**
     * Use to test the specific value that a mock function last returned.
     * If the last call to the mock function threw an error, then this matcher will fail
     * no matter what value you provided as the expected return value.
     */
    toHaveLastReturnedWith(expected: unknown): R;
    /**
     * Used to check that an object has a `.length` property
     * and it is set to a certain numeric value.
     */
    toHaveLength(expected: number): R;
    /**
     * Use to test the specific value that a mock function returned for the nth call.
     * If the nth call to the mock function threw an error, then this matcher will fail
     * no matter what value you provided as the expected return value.
     */
    toHaveNthReturnedWith(nthCall: number, expected: unknown): R;
    /**
     * Use to check if property at provided reference keyPath exists for an object.
     * For checking deeply nested properties in an object you may use dot notation or an array containing
     * the keyPath for deep references.
     *
     * Optionally, you can provide a value to check if it's equal to the value present at keyPath
     * on the target object. This matcher uses 'deep equality' (like `toEqual()`) and recursively checks
     * the equality of all fields.
     *
     * @example
     *
     * expect(houseForSale).toHaveProperty('kitchen.area', 20);
     */
    toHaveProperty(keyPath: string | Array<string>, value?: unknown): R;
    /**
     * Use to test that the mock function successfully returned (i.e., did not throw an error) at least one time
     */
    toHaveReturned(): R;
    /**
     * Use to ensure that a mock function returned successfully (i.e., did not throw an error) an exact number of times.
     * Any calls to the mock function that throw an error are not counted toward the number of times the function returned.
     */
    toHaveReturnedTimes(expected: number): R;
    /**
     * Use to ensure that a mock function returned a specific value.
     */
    toHaveReturnedWith(expected: unknown): R;
    /**
     * Check that a string matches a regular expression.
     */
    toMatch(expected: string | RegExp): R;
    /**
     * Used to check that a JavaScript object matches a subset of the properties of an object
     */
    toMatchObject(expected: Record<string, unknown> | Array<unknown>): R;
    /**
     * Ensure that a mock function has returned (as opposed to thrown) at least once.
     */
    toReturn(): R;
    /**
     * Ensure that a mock function has returned (as opposed to thrown) a specified number of times.
     */
    toReturnTimes(count: number): R;
    /**
     * Ensure that a mock function has returned a specified value at least once.
     */
    toReturnWith(value: unknown): R;
    /**
     * Use to test that objects have the same types as well as structure.
     */
    toStrictEqual(expected: unknown): R;
    /**
     * Used to test that a function throws when it is called.
     */
    toThrow(error?: string | Constructable | RegExp | Error): R;
    /**
     * If you want to test that a specific error is thrown inside a function.
     */
    toThrowError(error?: string | Constructable | RegExp | Error): R;
    /**
     * This ensures that a value matches the most recent snapshot.
     * Check out [the Snapshot Testing guide](https://jestjs.io/docs/en/snapshot-testing) for more information.
     */
    toMatchSnapshot(): R;
    /**
     * This ensures that a value matches the most recent image snapshot.
     * In many cases, you will want to use a screenshot of the contents of the
     * webpage; you can do that like so:
     *
     * ```ts
     * expect(await TestIt.captureScreenshot()).toMatchImageSnapshot();
     * ```
     *
     * You can also pass `{ fullsize: false }` to only screenshot the visible
     * portion of the webpage, rather than the whole web page from top to bottom:
     *
     * ```ts
     * expect(await TestIt.captureScreenshot({ fullsize: false })).toMatchImageSnapshot();
     * ```
     */
    toMatchImageSnapshot(): R;
  }
}

type Expect = {
  <T = unknown>(actual: T): TestItExpect.Matchers<T>;
  assertions(arg0: number): void;
  extend(arg0: any): void;
  extractExpectedAssertionsErrors: () => Array<{
    actual: string | number;
    error: Error;
    expected: string;
  }>;
  getState(): any;
  hasAssertions(): void;
  setState(arg0: any): void;
  any(expectedObject: any): Obj;
  anything(): Obj;
  arrayContaining(sample: Array<unknown>): Obj;
  objectContaining(sample: Record<string, unknown>): Obj;
  stringContaining(expected: string): Obj;
  stringMatching(expected: string | RegExp): Obj;
  [id: string]: Obj;
  not: {
    [id: string]: Obj;
  };
};

declare var expect: Expect;

type TestFnWithDescription = (
  description: string,
  testFn: (done: () => void) => any | Promise<any>
) => void;

type TestFnWithDescriptionAndOnlyAndSkip = TestFnWithDescription & {
  only: TestFnWithDescriptionAndOnlyAndSkip;
  skip: TestFnWithDescriptionAndOnlyAndSkip;
};

type TestFnWithoutDescription = (
  testFn: (done: () => void) => any | Promise<any>
) => void;

declare var describe: TestFnWithDescriptionAndOnlyAndSkip;
declare var fdescribe: TestFnWithDescription;
declare var xdescribe: TestFnWithDescription;
declare var test: TestFnWithDescriptionAndOnlyAndSkip;
declare var it: TestFnWithDescriptionAndOnlyAndSkip;
declare var debug: TestFnWithDescriptionAndOnlyAndSkip;
declare var fit: TestFnWithDescription;
declare var xit: TestFnWithDescription;
declare var beforeEach: TestFnWithoutDescription;
declare var beforeAll: TestFnWithoutDescription;
declare var before: TestFnWithoutDescription;
declare var afterEach: TestFnWithoutDescription;
declare var afterAll: TestFnWithoutDescription;
declare var after: TestFnWithoutDescription;

type TestItInterface = {
  captureScreenshot(options?: { fullsize: boolean }): Promise<Buffer>;
  resizeWindow(width: number, height: number): void;
};

declare var TestIt: TestItInterface;
