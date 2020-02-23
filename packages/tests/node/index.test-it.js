describe("node", () => {
  it("can `require` builtins", () => {
    const fs = require("fs");
    expect(typeof fs.readFile).toBe("function");
  });

  it("can `require` using a relative path", () => {
    const someFixture = require("./some-fixture");
    expect(someFixture).toBe("hi");
  });
});
