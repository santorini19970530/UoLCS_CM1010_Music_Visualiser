/* displays the play speed buttons */
class PlaySpeedDrawStrategy {
  constructor(type) {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.buttonType = type == "faster" ? "faster" : "slower";
  }

  draw() {
    this.y = height - 80;
    push();

    noStroke();
    fill(color(216, 217, 218));
    ellipseMode(RADIUS);
    rect(this.x, this.y - 20 / 2, this.width, this.height + 20);
    ellipse(this.x, this.y + this.height / 2, 20, this.height);
    ellipse(this.x + this.width, this.y + this.height / 2, 20, this.height);
    fill(color(97, 103, 122));

    // draw the fast forward logo triangles
    for (let i = 1; i <= 3; ++i)
      if (this.buttonType == "faster")
        triangle(
          this.x + 25 * i,
          this.y,
          this.x + 25 * (i + 0.8),
          this.y + this.height / 2,
          this.x + 25 * i,
          this.y + this.height
        );
      else if (this.buttonType == "slower")
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

/* check hit of play speed buttons
 then regulate the play speed in accordance to the button pressed */
class PlaySpeedHitChcekStrategy {
  constructor(type) {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.buttonType = type == "faster" ? "faster" : "slower";
  }

  // checks for clicks on the button, starts or pauses playabck, returns true if clicked false otherwise.
  hitCheck = function () {
    // range of x and y that is considered as button
    let x1 = this.x - 20;
    let x2 = this.x + this.width + 20;
    let y1 = this.y + this.height / 2 - this.height;
    let y2 = this.y + this.height / 2 + this.height * 1.5;

    if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
      playSpeed =
        this.buttonType == "faster" ? playSpeed + 0.1 : playSpeed - 0.1;
      if (sound.isPlaying()) sound.rate(playSpeed);

      return true;
    }

    return false;
  };
}
