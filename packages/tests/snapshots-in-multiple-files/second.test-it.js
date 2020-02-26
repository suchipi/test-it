describe("anotha one", () => {
  it("second test", () => {
    expect({ number: "three" }).toMatchSnapshot();
    expect({ number: "four" }).toMatchSnapshot();
  });
});
