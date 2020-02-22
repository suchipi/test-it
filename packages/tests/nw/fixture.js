describe("nw", () => {
  it("can access NW.js APIs", () => {
    // See http://docs.nwjs.io/en/latest/ for NW.js API documentation
    expect(nw).toBeDefined();
    expect(nw.Window.get().window).toBe(window);
  });
});
