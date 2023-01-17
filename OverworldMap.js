class OverworldMap {
  constructor(config) {
    this.overwold = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutScenePlaying = false;
    this.cutSceneSpaces = config.cutSceneSpaces || {};
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

    // NPC wracają do swoich behaviorLoop'ow
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))

  }

  // Sprawdzamy czy mozna odpalic w tym miejscu rozmowe z npc. Odpalamy to w overwold przy kliknieciu enter
  checkForActionCutScene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    })
    
    if(!this.isCutScenePlaying && match && match.talking.length) {
      this.startCutScene(match.talking[0].events)
    }
  }

  // przy kazdej nowej pozycji hero sprawdzamy czy mozemy odpalic na tym miejscu jakis custom cutscene
  checkForFootStepCutScene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutSceneSpaces[`${hero.x},${hero.y}`]
    if(!this.isCutScenePlaying && match) {
      this.startCutScene( match[0].events)
    }
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
        src: "images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 4000 },
          { type: "stand",  direction: "up", time: 4000 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "up", time: 1000 },
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "im busy...", faceHero: "npcA"},
              {type: "battle", enemyId: "beth"},
              // {type: "textMessage", text: "go away!"},
              // { who:"npcA", type: "walk",  direction: "up" },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "images/characters/people/erio.png",
        behaviorLoop: [
          { type: "walk",  direction: "right" },
          { type: "stand",  direction: "left", time: 4000 },
          { type: "walk",  direction: "down" },
          { type: "walk",  direction: "down" },
          { type: "walk",  direction: "down" },
          { type: "stand",  direction: "left", time: 1000 },
          { type: "walk",  direction: "left" },
          { type: "walk",  direction: "left" },
          { type: "walk",  direction: "left" },
          { type: "walk",  direction: "up" },
          { type: "walk",  direction: "up" },
          { type: "walk",  direction: "up" },
          { type: "walk",  direction: "right" },
          { type: "walk",  direction: "right" },

        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "don't get into my way!", faceHero: "npcB"},
              {type: "battle", enemyId: "erio"},
              // {type: "textMessage", text: "go away!"},
              // { who:"npcA", type: "walk",  direction: "up" },
            ]
          }
        ]
      }),
    },
    walls: {
      [utils.asGridCord(7,6)] : true,
      [utils.asGridCord(8,6)] : true,
      [utils.asGridCord(7,7)] : true,
      [utils.asGridCord(8,7)] : true,
      [utils.asGridCord(0,1)] : true,
      [utils.asGridCord(0,2)] : true,
      [utils.asGridCord(0,3)] : true,
      [utils.asGridCord(0,4)] : true,
      [utils.asGridCord(0,5)] : true,
      [utils.asGridCord(0,6)] : true,
      [utils.asGridCord(0,7)] : true,
      [utils.asGridCord(0,8)] : true,
      [utils.asGridCord(0,9)] : true,
      [utils.asGridCord(1,3)] : true,
      [utils.asGridCord(2,3)] : true,
      [utils.asGridCord(3,3)] : true,
      [utils.asGridCord(4,3)] : true,
      [utils.asGridCord(5,3)] : true,
      [utils.asGridCord(6,4)] : true,
      [utils.asGridCord(8,4)] : true,
      [utils.asGridCord(9,3)] : true,
      [utils.asGridCord(10,3)] : true,
      [utils.asGridCord(11,4)] : true,
      [utils.asGridCord(11,5)] : true,
      [utils.asGridCord(11,6)] : true,
      [utils.asGridCord(11,7)] : true,
      [utils.asGridCord(11,8)] : true,
      [utils.asGridCord(11,9)] : true,
      [utils.asGridCord(1,10)] : true,
      [utils.asGridCord(2,10)] : true,
      [utils.asGridCord(3,10)] : true,
      [utils.asGridCord(4,10)] : true,
      [utils.asGridCord(6,10)] : true,
      [utils.asGridCord(7,10)] : true,
      [utils.asGridCord(8,10)] : true,
      [utils.asGridCord(9,10)] : true,
      [utils.asGridCord(10,10)] : true,
    },
    cutSceneSpaces: {
      [utils.asGridCord(7,4)] : [
        {
          events: [
            {who: "npcB", type: "walk", direction: "left"},
            {who: "npcB", type: "stand", direction: "up", time: 800},
            {type: "textMessage", text: "You cant be in there!!!"},
            {who: "npcB", type: "walk", direction: "right"},
          ]
        }
      ],
      [utils.asGridCord(5,10)] : [
        {
          events:[
            {type: "changeMap", map: "Kitchen"}
          ]
        }
      ]
    }
  },
  Kitchen: {
    lowerSrc: "images/maps/KitchenLower.png",
    upperSrc: "images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(9),
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(6),
        src: "images/characters/people/npc4.png",
        talking: [
          {
            events: [
              {type: "textMessage", text: "im busy...", faceHero: "npcA"},
              {type: "textMessage", text: "go away!"},
              { who:"npcA", type: "walk",  direction: "left" },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(11),
        y: utils.withGrid(6),
        src: "images/characters/people/npc5.png",
        talking: [
          {
            events: [
              {type: "textMessage", text: "im busy...", faceHero: "npcA"},
              {type: "textMessage", text: "go away!"},
              { who:"npcB", type: "walk",  direction: "right" },
            ]
          }
        ]
      })
    }
  }
}