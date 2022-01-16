window.actions = {
  damage1: {
    name: "Whomp!",
    description: "Spill tabasko on enemy! ",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION} on {TARGET}!"},
      {type: "animation", animation: "spin"},
      {type: "stateChange", damage: 10}
    ]
  },
  saucyStatus: {
    name: "Tomato Squeeze!",
    targetType: "friendly",
    description: "Applies Saucy status!",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION}"},
      {type: "stateChange", status: {type: "saucy", expiresIn: 3}}
    ]
  },
  clumsyStatus: {
    name: "Olive Oil",
    targetType: "enemy",
    description: "Applies clumsy status!",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION}"},
      {type: "animation", animation: "glob", color: "#dafd2a"},
      {type: "stateChange", status: {type: "clumsy", expiresIn: 3}}
    ]
  },

  //items
  item_recoverStatus: {
    name: "Heating lamp",
    targetType: "friendly",
    description: "feeling fresh and warm",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION}"},
      {type: "stateChange", status: null},
      {type: "textMessage", text: "Feeling fresh!"},
    ]
  },
  item_recoverHp: {
    name: "Parmesan",
    targetType: "friendly",
    description: "feeling fresh and warm",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION}"},
      {type: "stateChange", recover: 15},
      {type: "textMessage", text: "Mmmmmm"},
    ]
  },
}