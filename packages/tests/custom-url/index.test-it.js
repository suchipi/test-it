test("looks right", async () => {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.style.fontFamily = "Helvetica";
  });
  expect(await TestIt.captureScreenshot()).toMatchImageSnapshot();
});
