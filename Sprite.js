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
    this.animation = config.animation || {
      "idleDown": [
        [0,0]
      ]
    };
    this.currentAnimation = config.currentAnimation || "idleDown";
    this.animationFrame = 0;
  }

  draw(ctx) {
    const x = this.gameObject.x * 16 - 8;
    const y = this.gameObject.y * 16 - 18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    this.isLoaded && ctx.drawImage(this.image,
      0,0, // left,top crop
      32,32, //size of cut width, height
      x,y, //hero position
      32,32 //hero size 
    )
  }
}