class TurnCycle {
  constructor({ battle, onNewEvent, onWinner}) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
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
    console.log(submission, "submission")

    //Zatrzymaj tutaj jeśli zmieniamy pizze
    if(submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `Go get them, ${submission.replacement.name}!`
      })
      this.nextTurn();
      return;
    }

    // Sprawdzamy czy przyszedl instance w submission, jesli tak to wyrzucamy ten item z tablicy itemow
    if(submission.instanceId) {
      //Dodanie do listy uzytych
      this.battle.usedInstanceIds[submission.instanceId] = true;

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

    //Sprawdzamy czy cel umarł
    const targetDead = submission.target.hp <=0;
    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage", text: `${submission.target.name} just get eaten by the enemy`
      })

      if(submission.target.team === "enemy") {

        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;

        await this.onNewEvent({
          type: "textMessage", text: `Gained ${xp} xp`
        })

        await this.onNewEvent({
          type: "giveXp", xp, combatant: this.battle.combatants[playerActivePizzaId]
        })
      }
    }

    //Sprawdzamy czy jest juz wygrany. Jesli tak to konczymy walke jesli nie to wrzucamy drugą pizze

    const winner = this.getWinningTeam();
    if(winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: `Winner!`
      })


      this.onWinner(winner);
      return;
    }

    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team
      })
      await this.onNewEvent({
        type: "replace",
        replacement: replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `${replacement.name}, appears!`
      })
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

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }

  getWinningTeam() {
    let aliveTeams = {}
    Object.values(this.battle.combatants).forEach(c => {
      if(c.hp > 0) {
        aliveTeams[c.team] = true;
      }
    })
    if(!aliveTeams["player"]) {return "enemy"};
    if(!aliveTeams["enemy"]) {return "player"};
    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `${this.battle.enemy.name} just challenged you!`
    });
    //zaczynamy pierwsza turę!
    this.turn()
  }
}