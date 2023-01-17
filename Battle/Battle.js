class Battle {
  constructor({enemy, onComplete}) {

    this.enemy = enemy;
    this.onComplete = onComplete;
    console.log(enemy, "enemy")

    this.combatants = {}
    
    this.activeCombatants = {
      player: null,
      enemy: null,
    }


    //Dodajemy gracza dynamicznie
    window.playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", window.playerState.pizzas[id]);
    })

    console.log(this.enemy, "enemy")
    //dodajemy przeciwnika
    Object.keys(this.enemy.pizzas).forEach(key => {
      this.addCombatant("e_" + key, "enemy", this.enemy.pizzas[key]);
    })

    this.items = [];

    //dodajemy przedmioty gracza
    window.playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      });
    })

    this.usedInstanceIds = {}
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant({
      ...Pizzas[config.pizzaId],
      ...config,
      team: team,
      isPlayerControlled: team === "player"
    }, this);

    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="${'images/characters/people/hero.png'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" />
      </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      if(combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if(combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    })

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);


    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        })
      },
      onWinner: winner => {

        if(winner === "player") {
          const playerState = window.playerState;
          Object.keys(playerState.pizzas).forEach(id => {
            const playerStatePizza = playerState.pizzas[id];
            const combatant = this.combatants[id]

            if(combatant) {
              playerStatePizza.hp = combatant.hp;
              playerStatePizza.maxXp = combatant.maxXp;
              playerStatePizza.xp = combatant.xp;
              playerStatePizza.level = combatant.level;

            }
          })
          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId]
          })

          //Wysłać sygnał żeby zaktualizować hud
          utils.emitEvent("PlayerStateUpdate");
        }
        this.element.remove();
        this.onComplete();
      }
    })
    this.turnCycle.init()
  }
}