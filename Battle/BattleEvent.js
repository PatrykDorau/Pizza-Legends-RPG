class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {

    const text = this.event.text
    .replace("{CASTER}", this.event.caster?.name)
    .replace("{TARGET}", this.event.target?.name)
    .replace("{ACTION}", this.event.action?.name)

    const msg = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      }
    })
    msg.init(this.battle.element)
  }

  async stateChange(resolve) {
    const {caster, target, damage} = this.event
    if(damage) {

      target.update({
        hp: target.hp - damage
      })
      console.log("hello")
      target.pizzaElement.classList.add("battle-damage-blink");
    }
    await utils.wait(500)

    target.pizzaElement.classList.remove("battle-damage-blink");
    resolve();
  }

  submissionMenu(resolve) {
    const menu = new SubmissionMenu({
      caster: this.event.caster,
      enemy: this.event.enemy,
      onComplete: submission => {
        // submission - co użyc i na kogo
        resolve(submission);
      }
    })
    menu.init(this.battle.element)
  }

  animation(resolve) {
    const func = BattleAnimations[this.event.animation]
    func(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}