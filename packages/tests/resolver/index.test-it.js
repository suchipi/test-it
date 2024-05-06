const something = require("./something.txt");

it("loads the file", () => {
  expect(something).toBe("data:text/plain;base64,aGVsbG8gd29ybGQK");
});
