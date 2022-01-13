window.actions = {
  damage1: {
    name: "Whomp!",
    success: [
      {type: "textMessage", text: " {CASTER} uses {ACTION} on {TARGET}!"},
      {type: "animation", animation: "spin"},
      {type: "stateChange", damage: 10}
    ]
  }
}