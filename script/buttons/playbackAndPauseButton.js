/* displays the playback button. */

class PlaybackAndPauseDrawStrategy {
  constructor() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
  }

  // draw the playback button
  draw() {
    this.y = height - 80;
    push();

    ellipseMode(RADIUS);
    fill(color(136, 196, 255));
    ellipse(
      this.x + this.width * 0.4,
      this.y + this.height / 2,
      this.width * 1.5,
      this.width * 1.5
    );

    pop();

    // drawing sign of playing / pausing
    if (controls.playing) {
      rect(this.x, this.y, this.width / 2 - 2, this.height);
      rect(this.x + this.width / 2, this.y, this.width / 2 - 2, this.height);
    } else
      triangle(
        this.x,
        this.y,
        this.x + this.width,
        this.y + this.height / 2,
        this.x,
        this.y + this.height
      );
  }
}

/* check the hit check */
class PlaybackAndPauseHitCheckStrategy {
  constructor() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
  }

  // checks for clicks on the button, starts or pauses playabck, returns true if clicked false otherwise.
  hitCheck = function () {
    // range of x and y that is considered as button
    let x1 = this.x + this.width * 0.4 - this.width * 1.5;
    let x2 = this.x + this.width * 0.4 + this.width * 1.5;
    let y1 = this.y + this.height / 2 - this.width * 1.5;
    let y2 = this.y + this.height / 2 + this.width * 1.5;

    if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
      if (sound.isPlaying()) sound.pause();
      else {
        sound.loop();
        sound.rate(playSpeed);
      }

      controls.playing = !controls.playing;

      return true;
    }

    return false;
  };
}
