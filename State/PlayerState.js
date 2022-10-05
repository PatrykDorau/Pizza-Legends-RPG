class PlayerState {
  constructor() {
    this.pizzas = {
      "p1": {
        pizzaId: "s001",
        hp:30,
        maxHp:50,
        xp:95,
        maxXp: 100,
        level: 1,
        status: null,
      },
      "p2": {
        pizzaId: "v001",
        hp:50,
        maxHp:50,
        xp:5,
        maxXp: 100,
        level: 1,
        status: null,
      },
    }
    this.lineup = ["p1", "p2"];
    this.items = [
      {actionId: "item_recoverStatus", instanceId: "p1"},
      {actionId: "item_recoverStatus", instanceId: "p2"},
    ];
  }
}

window.playerState = new PlayerState();