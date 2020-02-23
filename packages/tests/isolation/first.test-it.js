describe("first", () => {
  it("is isolated from other tests", () => {
    expect(window.something).toBe(undefined);
    window.something = true;
    expect(window.something).toBe(true);
  });
});
