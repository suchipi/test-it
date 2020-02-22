describe("dom", () => {
  it("can access a real DOM (Chromium)", () => {
    const firstDiv = document.createElement("div");
    firstDiv.textContent = "Hello, ";
    document.body.appendChild(firstDiv);

    const secondDiv = document.createElement("div");
    secondDiv.textContent = "DOM!";
    document.body.appendChild(secondDiv);

    // You can access `textContent` in jsdom...
    expect(document.body.textContent.trim()).toBe("Hello, DOM!");
    // but not `innerText`
    expect(document.body.innerText.trim()).toBe("Hello,\nDOM!");
  });
});
