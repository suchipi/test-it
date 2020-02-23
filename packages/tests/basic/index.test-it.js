describe("basic", () => {
  it("succeeding test", () => {
    expect(2 + 2).toBe(4);
  });

  it("failing test", () => {
    expect(2 + 2).toBe(5);
  });

  xit("pending test", () => {
    expect(2 + 2).toBe(7);
  });
});
