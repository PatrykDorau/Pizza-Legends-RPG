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

    // tutaj tworzymy cale menu wyboru akcji, i czekamy az caster zatwierdzi akcje 
    const submission = await this.onNewEvent({
      type: "submissionMenu", 
      caster,
      enemy
    })
    console.log(submission)

    // Sprawdzamy czy pprzyszedl instance w submission, jesli tak to wyrzucamy ten item z tablicy itemow
    if(submission.instanceId) {
      this.battle.items = this.battle.items.filter( i => i.instanceId !== submission.instanceId)
    }

    // czy caster da rade trafic, jesli tak to zostaje submission.action.succes a jesli nie to dajemy textmsg
    const resultingEvents = caster.getReplacedEvents(submission.action.success);
    // Eventy które maja dziac sie najpierw z wybranej przez castera akcji
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

    // Eventy ktore maja dziac sie pozniej czyli rozpatrujemy status \ getPostEvents w combatant.js
    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }
    //Sprawdz czy status nie wygasl. w combatant.js 
    const expiredEvent = caster.decrementStatus();
    if(expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }

    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn()
  }

  async init() {
    // await this.onNewEvent({
    //   type: "textMessage",
    //   text: "Battle is starting!!!"
    // });
    //zaczynamy pierwsza turę!
    this.turn()
  }
}