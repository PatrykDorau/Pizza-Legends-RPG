class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.keyMap = {
      "ArrowUp": "up",
      "ArrowDown": "down",
      "ArrowLeft": "left",
      "ArrowRight": "right",
      "KeyW": "up",
      "KeyA": "left",
      "KeyS": "down",
      "KeyD": "right",
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", e=> {
      const dir = this.keyMap[e.code];
      if(dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    })

    document.addEventListener("keyup", e=>{
      const dir = this.keyMap[e.code];
      const index = this.heldDirections.indexOf(dir);
      if(index > -1) {
        this.heldDirections.splice(index, 1);
      }
    })
  }
}