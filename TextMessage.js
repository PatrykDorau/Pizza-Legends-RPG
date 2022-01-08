class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    // tworzymy element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage_p">${this.text}</p>
      <button class="TextMessage_button">Next</button>
    `)

    this.element.querySelector("button").addEventListener("click", () => {
      //zamknij wiadomosc tekstowa
      this.done();
    });

    this.enterListener = new KeyPressListener("Enter", () => {
      this.done();
      this.enterListener.unbind();
    })
  }

  done() {
    this.element.remove();
    this.onComplete()
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }

}