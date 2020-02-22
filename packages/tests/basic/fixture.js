describe("thing", () => {
  it("works", () => {
    expect(2 + 2).toBe(4);
  });

  it("doesn't work", () => {
    expect(2 + 2).toBe(5);
  });

  xit("might work later", () => {
    expect(2 + 2).toBe(7);
  });
});
