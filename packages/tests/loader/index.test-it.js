import * as React from "react";
import App from "./App";

describe("basic", () => {
  it("JSX works", () => {
    expect(<App />).toBeInstanceOf(Object);
  });
});
