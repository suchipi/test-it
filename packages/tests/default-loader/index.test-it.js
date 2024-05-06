it("can load ts", () => {
  require("./fixture-ts");
});

it("can load tsx", () => {
  require("./fixture-tsx");
});

async function hi() {
  await new Promise((resolve) => setTimeout(resolve, 10));
  console.log(hi.toString());
  await new Promise((resolve) => setTimeout(resolve, 10));
}
it("doesn't compile async syntax", hi);
