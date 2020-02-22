describe("node", () => {
  it("can `require` builtins", () => {
    const fs = require("fs");
    expect(typeof fs.readFile).toBe("function");
  });

  it("can `require` using a relative path", () => {
    const fixture2 = require("./fixture2");
    expect(fixture2).toBe("hi");
  });
});
