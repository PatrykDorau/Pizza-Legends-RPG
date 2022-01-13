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

  }
}