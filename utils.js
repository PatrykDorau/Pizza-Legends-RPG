const utils = { 
  withGrid(n) { 
    return n * 16;
  },
  asGridCord(x, y) {
    return `${x*16},${y*16}`;
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if(direction === 'left') {
      x -= size;
    } else if(direction === 'right') {
      x += size;
    } else if(direction === 'up') {
      y -= size;
    } else if(direction === 'down') {
      y += size
    }
    return {x,y};
  },

  emitEvent(name, detail) {
    const event = new CustomEvent(name, {detail});
    document.dispatchEvent(event);
  },

  oppositeDirection(direction) {
    if(direction === 'left') { return "right"}
    if(direction === 'right') { return "left"}
    if(direction === 'up') { return "down"}
    if(direction === 'down') { return "up"}
  },

  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => { 
        resolve();
      }, ms)
    })
  },

}