const tick = () => new Promise((resolve) => requestAnimationFrame(resolve));

test("requestAnimationFrame runs", async () => {
  let ran = false;
  requestAnimationFrame(() => {
    ran = true;
  });
  await tick();
  expect(ran).toBe(true);
});
