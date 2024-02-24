// control the volumes

class VolumeControlDrawStrategy {
  constructor(type) {
    this.x = null;
    this.y = null;
    this.width = null;
    this.hieght = null;
    this.volumeMovement = type == "up" ? "up" : "down";
  }

  draw() {
    this.y = height - 70;
    push();

    noStroke();
    fill(color(216, 217, 218));
    ellipseMode(RADIUS);
    ellipse(this.x, this.y, 30, 30);
    fill(color(97, 103, 122));

    // draw the triangle with up or down direction
    if (this.buttonType == "up")
      triangle(
        this.x + 25 * i,
        this.y,
        this.x + 25 * (i + 0.8),
        this.y + this.height / 2,
        this.x + 25 * i,
        this.y + this.height
      );
    else if (this.buttonType == "downr")
      triangle(
        this.x + this.width - 25 * i,
        this.y,
        this.x + this.width - 25 * (i + 0.8),
        this.y + this.height / 2,
        this.x + this.width - 25 * i,
        this.y + this.height
      );

    pop();
  }
}

// check hit of volume control buttons
// then regulate the volume of music play in accordance to the button pressed
// also the volume will be restricted in a limit of range
class VolumeControlCheckStrategy {
  constructor(type) {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.volumeMovement = type == "up" ? "up" : "down";
  }

  // checks for clicks on the button, starts or pauses playback, returns true if clicked false otherwise.
  //
  hitCheck = function () {
    // range of x and y that is considered as button
    let x1 = this.x - 20;
    let x2 = this.x + this.width + 20;
    let y1 = this.y + this.height / 2 - this.height;
    let y2 = this.y + this.height / 2 + this.height * 1.5;

    if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
      playVolume =
        this.volumeMovement == "up" ? playVolume + 0.1 : playVolume - 0.1;
      if (sound.isPlaying()) sound.setVolume(playVolume);
      console.log(playVolume);

      return true;
    }

    return false;
  };
}
