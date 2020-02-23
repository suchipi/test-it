const something = require("./something");

it("loads the file", () => {
  expect(something).toBe("something-content");
});
