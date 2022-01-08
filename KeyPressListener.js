class KeyPressListener {
  constructor(keyCode, callback) {
    //keySafe po to aby nie odpalac tego eventu podczas trzymania przycisku tylko jednorazowo po kliknieciu
    let keySafe = true;
    this.keydownFunction = function(event) {
      if(event.code === keyCode) {
        if(keySafe) {
          keySafe = false;
          callback();
        }
      }
    };
    this.keyupFunction = function(event) {
      if(event.code === keyCode) {
        keySafe = true;
      }
    };

    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}