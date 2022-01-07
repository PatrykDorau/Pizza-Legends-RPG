class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutScenePlaying = true;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
  }
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
  }

  isSpaceTaken(currentX,currentY, direction) {
    const {x,y} = utils.nextPosition(currentX,currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];

      // nadajemy id tutaj takie jaki jest klucz naszego game objecta. Można byłoby to zrobić manualnie w gameObjects
      object.id = key;

      //Do zrobienia: Czy ten object powinien byc zmountowany?

      //mountujemy(dodajemy sciane i startujemy behaviorloop) kazdy objekt w gameobjects
      object.mount(this);
    })
  }

  async startCutScene(events) {
    this.isCutScenePlaying = true;

    for(let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      })
      await eventHandler.init();
    }

    this.isCutScenePlaying = false;

  }

  addWall(x ,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x ,y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction)
    this.addWall(x,y);
  }
}



window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "images/maps/DemoLower.png",
    upperSrc: "images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(2),
        y: utils.withGrid(5),
      }),
      npcA: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(8),
        src: "images/characters/people/npc2.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "up", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "up", time: 300 },
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "images/characters/people/npc3.png",
        behaviorLoop: [
          { type: "walk",  direction: "right" },
          { type: "stand",  direction: "left", time: 800 },
          { type: "walk",  direction: "down" },
          { type: "walk",  direction: "down" },
          { type: "walk",  direction: "down" },
          { type: "stand",  direction: "left", time: 800 },
          { type: "walk",  direction: "left" },
          { type: "walk",  direction: "left" },
          { type: "walk",  direction: "left" },
          { type: "walk",  direction: "up" },
          { type: "walk",  direction: "up" },
          { type: "walk",  direction: "up" },
          { type: "walk",  direction: "right" },
          { type: "walk",  direction: "right" },

        ]
      }),
    },
    walls: {
      [utils.asGridCord(7,6)] : true,
      [utils.asGridCord(8,6)] : true,
      [utils.asGridCord(7,7)] : true,
      [utils.asGridCord(8,7)] : true,
    }
  },
  Kitchen: {
    lowerSrc: "images/maps/KitchenLower.png",
    upperSrc: "images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 3,
        y: 1,
      }),
      npc1: new GameObject({
        x: 3,
        y: 4,
        src: "images/characters/people/npc4.png"
      }),
      npc2: new GameObject({
        x: 2,
        y: 7,
        src: "images/characters/people/npc5.png"
      })
    }
  }
}