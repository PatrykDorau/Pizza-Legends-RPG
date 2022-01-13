class TurnCycle {
  constructor({ battle, onNewEvent}) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.currentTeam = "player"; // or "enemy"
  }

  async turn() {
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId = this.battle.activeCombatants[this.currentTeam === "player" ? "enemy" : "player"];
    const enemy = this.battle.combatants[enemyId]

    const submission = await this.onNewEvent({
      type: "submissionMenu", 
      caster,
      enemy
    })
    console.log(submission)
    const resultingEvents = submission.action.success;
    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }

    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn()
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: "battle is starting"
    });
    //zaczynamy pierwsza turę!
    this.turn()
  }
}