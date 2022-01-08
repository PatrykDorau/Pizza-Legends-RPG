class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "images/characters/people/hero.png"
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // Jeśli mamy jakiś this.behaviorLoop to odpalamy
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {
  }

  async doBehaviorEvent(map) {

    if(map.isCutScenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
      return;
    }

    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    // id tworzymy w mountObjects() za pomocą key'a
    eventConfig.who = this.id;

    // tworzymy nowy event
    const eventHandler = new OverworldEvent({map, event: eventConfig});
    await eventHandler.init();

    // kod poniżej wykona się dopiero gdy wróci resolve od promisa wyzej!

    this.behaviorLoopIndex += 1;
    if(this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }
}