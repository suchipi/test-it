describe("snapshot-testing", () => {
  it("first test", () => {
    expect({ number: "one" }).toMatchSnapshot();
    expect({ number: "two" }).toMatchSnapshot();
  });
});
