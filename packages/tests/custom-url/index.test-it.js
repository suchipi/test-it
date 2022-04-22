test("looks right", async () => {
  expect(await TestIt.captureScreenshot()).toMatchImageSnapshot();
});
