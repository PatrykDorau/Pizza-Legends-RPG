window.actions = {
  damage1: {
    name: "Whomp!",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION} on {TARGET}!"},
      {type: "animation", animation: "spin"},
      {type: "stateChange", damage: 10}
    ]
  },
  saucyStatus: {
    name: "Tomato Squeeze!",
    targetType: "friendly",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION}"},
      {type: "stateChange", status: {type: "saucy", expiresIn: 3}}
    ]
  },
  clumsyStatus: {
    name: "Olive Oil",
    targetType: "enemy",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION}"},
      {type: "animation", animation: "glob", color: "#dafd2a"},
      {type: "stateChange", status: {type: "clumsy", expiresIn: 3}}
    ]
  }
}