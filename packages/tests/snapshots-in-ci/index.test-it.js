describe("snapshots-in-ci", () => {
  it("first test", () => {
    expect({ number: "one" }).toMatchSnapshot();
  });
});
