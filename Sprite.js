class Sprite {
  constructor(config) {

    // Tworzenie grafik
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // Tworzenie cienia pod postaciami
    this.shadow = new Image();
    //Czy postac ma miec cien, narazie hardcode ale pozniej do zmiany
    this.useShadow = true; //config.useShadow || false;
    if (this.useShadow) {
      this.shadow.src = "images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //dostep do gameobject
    this.gameObject = config.gameObject;

    // Wybór animacji
    this.animations = config.animation || {
      "idle-down": [ [0,0] ],
      "idle-up": [ [0,2] ],
      "idle-left": [ [0,3] ],
      "idle-right": [ [0,1] ],
      "walk-down": [[1,0], [0,0], [3,0], [0,0]],
      "walk-right": [[1,1], [0,1], [3,1], [0,1]],
      "walk-up": [[1,2], [0,2], [3,2], [0,2]],
      "walk-left": [[1,3], [0,3], [3,3], [0,3]],
    };

    this.currentAnimation = config.currentAnimation;
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 16;
    this.animationFrameProgress = this.animationFrameLimit;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if( this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimation() {
    if(this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //resetujemy licznik
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if(this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const[frameX, frameY] = this.frame

    this.isLoaded && ctx.drawImage(this.image,
      frameX * 32,frameY * 32, // left,top crop
      32,32, //size of cut width, height
      x,y, //hero position
      32,32 //hero size 
    )
    this.updateAnimation();
  }
}