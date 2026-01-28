import React from "inferno-compat";
import App from "./App";

describe("inferno-compat", () => {
  let rootEl = null;

  beforeEach(() => {
    rootEl = document.createElement("div");
    document.body.append(rootEl);
  });

  afterEach(() => {
    document.body.removeChild(rootEl);
  });

  it("works", () => {
    React.render(<App />, rootEl);
    expect(rootEl.innerHTML).toBe("<div>hi</div>");
  });
});
