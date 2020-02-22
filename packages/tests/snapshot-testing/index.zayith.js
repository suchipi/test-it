describe("snapshot-testing", () => {
  it("first test", () => {
    expect({ haha: "yolo" }).toMatchSnapshot();
  });
  it("second test", () => {
    expect(new Error("hi")).toMatchSnapshot();
  });
});
