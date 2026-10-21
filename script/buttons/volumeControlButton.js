/* control the volumes
since the p5.js slider can only be styled using CSS code, self creating another one would be better for styling */

class VolumeControlDrawStrategy {
  constructor() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.sliderPos = 0.1;
  }

  draw() {
    this.y = height - 80;
    push();
    stroke(255, 246, 224);
    fill(216, 217, 218);
    rect(this.x, this.y, this.width, this.height);
    stroke(97, 103, 122);
    fill(136, 196, 255);
    rect(this.x + this.width * this.sliderPos - 10, this.y - 5, 20, 30);
    pop();
  }

  // update this position when volume changes
  setSliderPos(soundLevel) {
    this.sliderPos = soundLevel;
  }
}

/* check hit of volume control buttons
 then regulate the volume of music play in accordance to the button pressed
 also the volume will be restricted in a limit of range */
class VolumeControlCheckStrategy {
  constructor() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
  }

  // checks for clicks on the button, starts or pauses playback, returns true if clicked false otherwise.
  hitCheck = function () {
    // range of x and y that is considered as button
    let x1 = this.x - 20;
    let x2 = this.x + this.width + 20;
    let y1 = this.y - 20;
    let y2 = this.y + this.height + 20;

    if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
      const level = constrain(
        map(mouseX, this.x, this.x + this.width, 0.1, 1),
        0.1,
        1
      );
      player.volume = level;
      controls.buttons.volumeControlSlider.drawStrategy.setSliderPos(level);
      return true;
    }

    return false;
  };
}
