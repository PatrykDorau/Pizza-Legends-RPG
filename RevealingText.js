class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 50;

    this.timeout = null;
    this.isDone = false;
  }

  // ukazujemy każdą litere po kolei z małym opoznieniem dodając jej klasę revealed
  revealOneCharacter(list) {
    const next = list.splice(0,1)[0];
    next.span.classList.add("revealed");

    if(list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter)
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span").forEach((el) => {
      el.classList.add("revealed");
    })
  }

  init() {
    let characters = [];
    // dzielimy tekst w tablice
    this.text.split("").forEach(character => {

      //Tworzymy span dla kazdej litery i dodajemy do DOM
      let span = document.createElement('span');
      span.textContent = character;
      this.element.appendChild(span);

      // Dodajemy span do tablicy i przesyłamy do funkji która nadaję klasy
      characters.push({span, delayAfter: character === " " ? 0 : this.speed});
    })
    this.revealOneCharacter(characters);
  }

}