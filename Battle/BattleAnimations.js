window.BattleAnimations = {
  async spin( event, onComplete) {
    const element = event.caster.pizzaElement;
    const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";

    element.classList.add(animationClassName);

    //wywalamy klase jesli skonczyla sie animacja
    element.addEventListener("animationend", () => {
      element.classList.remove(animationClassName);
    }, { once: true})

    //timujemy tak aby zgralo sie odjecie hp z uderzeniem pizzy
    await utils.wait(100);
    onComplete();

  },

  async glob(event, onComplete) {
    const caster = event.caster;

    let div = document.createElement("div");
    div.classList.add("glob-orb");
    div.classList.add(caster.team === "player" ? "battle-glob-right" : "battle-glob-left");

    div.innerHTML = (`
      <svg viewBox=" 0 0 32 32" width="32" height="32">
        <circle cx="12" cy="12" r="12" fill="${event.color}"
      </svg>
    `);

    div.addEventListener("animationend", () => {
      div.remove();
    })

    document.querySelector(".Battle").appendChild(div);

    await utils.wait(800);
    onComplete();
  }
}