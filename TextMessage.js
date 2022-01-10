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
      <p class="TextMessage_p"></p>
      <button class="TextMessage_button">Next</button>
    `)

    this.revealingText = new RevealingText({element: this.element.querySelector(".TextMessage_p"), text: this.text});

    this.element.querySelector("button").addEventListener("click", () => {
      //zamknij wiadomosc tekstowa
      this.done();
    });

    this.enterListener = new KeyPressListener("Enter", () => {
      this.done();
    })
  }

  done() {
    if(this.revealingText.isDone) {
      this.element.remove();
      this.onComplete();
      this.enterListener.unbind();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

}