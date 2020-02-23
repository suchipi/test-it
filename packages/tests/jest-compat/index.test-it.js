test("test", () => {});
test.only("test.only", () => {});
test.skip("test.skip", () => {});

it("it", () => {});
it.only("it.only", () => {});
it.skip("it.skip", () => {});

describe("describe", () => {
  test("test", () => {});
});

describe.only("describe", () => {
  test("test", () => {});
});

describe.skip("describe", () => {
  test("test", () => {});
});
