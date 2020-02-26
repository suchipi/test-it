describe("here we go", () => {
  it("first test", () => {
    expect({ number: "one" }).toMatchSnapshot();
    expect({ number: "two" }).toMatchSnapshot();
  });
});
