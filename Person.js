class Person extends GameObject {
  constructor(config) {
    //this.x , this.y, this.direction !!! , this.sprite od super
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;

    this.isPlayerControlled = config.isPlayerControlled || false;

    //default to 1 wszedzie zamiast 0.5. Musi być zmienione this.movingprogressRemaining na 16 z 32
    this.directionUpdate = {
      "up": ["y", -0.5],
      "down": ["y", 0.5],
      "left": ["x", -0.5],
      "right": ["x", 0.5],
    }
  }

  update(state) {
    if(this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // gotowe do przyjmowania inputu od gracza
      if(!state.map.isCutScenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        });
      }
      this.updateSprite(state);
    }
  }

  // odpalamy tą funkcje kiedy mountujemy objekt, wykonuje on swój behaviorLoop i uzywana jest też do przemieszczania postaci
  startBehavior(state, behavior) {
    //ustawiamy kierunek na taki jaki ma ustawiony w behavior
      this.direction = behavior.direction;

      if(behavior.type === "walk") {
        // zatrzymaj się jeśli twoje miejsce docelowe jest zajete
        if(state.map.isSpaceTaken(this.x, this.y, this.direction)) {

          behavior.retry && setTimeout(() => {
            this.startBehavior(state, behavior)
          }, 600)
          return;
        }

        //jezeli miejsce docelowe jest wolne to jazda, Default to 16 ale za szybko dla mnie. Zmieniamy miejsce sciany podczas poruszania
        state.map.moveWall(this.x, this.y, this.direction);
        this.movingProgressRemaining = 32;
        this.updateSprite(state);
      }

      if(behavior.type === "stand") {
        this.isStanding = true;
        setTimeout(() => {
          utils.emitEvent("PersonStandComplete", { whoId: this.id})
          this.isStanding = false;
        },behavior.time)
      }
  }

  updatePosition() {
      const [property,change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;

      if(this.movingProgressRemaining === 0) {
        // Dajemy znac ze skonczylismy chodzic                                 SPRAWDZIC JAK DZIALA DOKLADNIE!!!!
        utils.emitEvent("PersonWalkingComplete", { whoId: this.id})
      }
  }

  updateSprite() {
    if(this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    this.sprite.setAnimation("idle-"+this.direction);
  }
}