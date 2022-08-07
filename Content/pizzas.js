window.PizzaTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
}

window.Pizzas = {
  "s001": {
    name: "Slice Samuraj",
    type: PizzaTypes.spicy,
    description: "Desc",
    src: "images/characters/pizzas/s001.png",
    icon: "images/icons/spicy.png",
    actions: ["clumsyStatus", "saucyStatus", "damage1"]
  },
  "s002": {
    name: "Bacon Brigade",
    type: PizzaTypes.spicy,
    description: "salty warrior",
    src: "images/characters/pizzas/s001.png",
    icon: "images/icons/spicy.png",
    actions: ["clumsyStatus", "saucyStatus", "damage1"]
  },
  "v001": {
    name: "Call Me Kale",
    type: PizzaTypes.veggie,
    description: "Desc",
    src: "images/characters/pizzas/v001.png",
    icon: "images/icons/veggie.png",
    actions: ["damage1"]
  },
  "f001": {
    name: "Portobello Express",
    type: PizzaTypes.fungi,
    description: "Desc",
    src: "images/characters/pizzas/f001.png",
    icon: "images/icons/fungi.png",
    actions: ["damage1"]
  },
}