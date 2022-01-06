class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
  }

  startGameLoop() {
    const step = () => {

      //czyscimy widok
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Tworzymy dolna czesc mapy
      this.map.drawLowerImage(this.ctx)

      // Tworzymy wszystkie objekty które mamy w this.map w game object
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction
        })
        object.sprite.draw(this.ctx)
      })

      // Tworzymy górna czesc mapy
      this.map.drawUpperImage(this.ctx)

      requestAnimationFrame(() => {
        step()
      })
    }
    step();
  }


  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom)

    this.directionInput = new DirectionInput()
    this.directionInput.init();

    this.startGameLoop()
  }
}