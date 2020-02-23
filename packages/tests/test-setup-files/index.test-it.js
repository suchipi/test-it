it("runs after the test setup file", () => {
  expect(window.somethingFromSetup).toBe(true);
});
