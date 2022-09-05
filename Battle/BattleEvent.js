class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {
    console.log(this.event.text);

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
    // destructure this.caster = this.event.caster np.
    console.log(this.event, "event")
    const {caster, target, damage, recover, status, action} = this.event
    let who = this.event.onCaster ? caster : target;

    if(damage) {
      target.update({
        hp: target.hp - damage
      })
      target.pizzaElement.classList.add("battle-damage-blink");
    }

    if(recover) {
      let newHp = who.hp + recover;
      if(newHp > who.maxHp) {
        newHp = who.maxHp
      }
      who.update({
        hp: newHp
      })
    }

    if(status) {
      who.update({
        status: {...status}
      })
    }
    if(status === null) {
      who.update({
        status: null
      })
    }

    await utils.wait(500);

    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();

    target.pizzaElement.classList.remove("battle-damage-blink");
    resolve();
  }

  submissionMenu(resolve) {
    const {caster} = this.event;
    const menu = new SubmissionMenu({
      caster: caster,
      enemy: this.event.enemy,
      items: this.battle.items,
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.id !== caster.id && c.team === caster.team && c.hp > 0
      }),
      onComplete: submission => {
        // submission - co użyc i na kogo
        resolve(submission);
      }
    })
    menu.init(this.battle.element)
  }

  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.team === this.event.team && c.hp > 0
      }),
      onComplete: replacement => {
        resolve(replacement);
      }
    })

    menu.init(this.battle.element)
  }

  async replace(resolve) {
    const {replacement} = this.event;

    const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]]
    this.battle.activeCombatants[replacement.team] = null;
    console.log(prevCombatant, "prev")
    prevCombatant.update();

    await utils.wait(400);

    //wchodzi nowa pizza
    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();

    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();

    await utils.wait(400);

    resolve();
  }

  animation(resolve) {
    const func = BattleAnimations[this.event.animation]
    func(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}