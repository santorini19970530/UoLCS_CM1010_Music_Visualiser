/* constructor function to draw the status bars (originally needles) */

class Needles {
  // private
  // how large is the arc of the needle plot.
  #radius = 100;
  #energy;

  // public
  name = "needles";

  //frquencies used by the energyfunction to retrieve a value for each plot
  // human detectable sound frequencies are ranged between 16Hz and 32,768 Hz
  // 16,384 Hz - 32,768 Hz are too high that not included in the songs
  // hence i use the other ranges to divide into seven ranges for illustrating rainbow visual
  #frequencyBins = [
    { lower: 16, upper: 32 },
    { lower: 32, upper: 280 },
    { lower: 280, upper: 512 },
    { lower: 512, upper: 2048 },
    { lower: 2048, upper: 8192 },
    { lower: 8192, upper: 12288 },
    { lower: 12288, upper: 16384 },
  ];
  #rainbow = [
    color(255, 26, 26),
    color(265, 165, 0),
    color(255, 255, 26),
    color(0, 200, 0),
    color(0, 194, 222),
    color(0, 65, 141),
    color(95, 40, 211),
  ];

  // draw the plots to the screen
  draw() {
    // create an array amplitude values from the fft.
    player.analyse();

    this.drawVarientBackground(
      color(player.energy("lowMid"), 100, player.energy("highMid"))
    );

    push();

    noStroke();

    translate(width / 2, height / 2);
    for (let i = 0; i < this.#rainbow.length; i++) this.drawFrequencyRing(i);

    pop();

    this.ticks();
  }

  // getEnergy with two arguments is the average amplitude of that frequency range
  drawFrequencyRing(index) {
    this.#energy = player.energy(
      this.#frequencyBins[index].lower,
      this.#frequencyBins[index].upper
    );
    this.drawRingDots(index, map(this.#energy, 0, 255, 0, 360));
  }

  drawRingDots(index, maxAngle) {
    for (let alpha = 0; alpha <= maxAngle; alpha++) {
      fill(this.#rainbow[index]);
      let r = this.#radius + index * 30;
      ellipse(r * cos(alpha - 90), r * sin(alpha - 90), 20);
    }
  }

  // private
  // draw the graph ticks on an indivisual plot
  ticks() {
    let tickRadius = this.#radius - 20;

    push();

    stroke(color(255, 255, 255));
    strokeWeight(2);
    fill("#333333");
    translate(width / 2, height / 2);

    //draw the semi circle for the botttom of the needle
    textAlign(CENTER);

    for (let alpha = 0; alpha <= 360; alpha++) {
      //for each tick work out the start and end coordinates of
      //based on its angle from the needle's origin.
      if (alpha % 18 == 0) {
        let x = tickRadius * cos(alpha);
        let x1 = (tickRadius - 5) * cos(alpha);

        let y = tickRadius * sin(alpha);
        let y1 = (tickRadius - 5) * sin(alpha);

        line(x, y, x1, y1);
      }
      if (alpha % (18 * 5) == 0 && alpha < 360) {
        push();
        let x = (tickRadius - 30) * cos(alpha - 90);
        let y = (tickRadius - 30) * sin(alpha - 90);
        stroke(color(200, 200, 200));
        strokeWeight(1);
        fill(color(254, 254, 254));
        textFont(fontNamed("fontDigit"));
        textSize(15);
        text(String(Math.floor(map(alpha, 0, 360, 0, 255))), x, y);
        pop();
      }
    }

    pop();
  };

  // make the background looks like near the sun
  // linearGradient is not p5.js function, this is WebAPI function
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

  drawVarientBackground(c) {
    let gradient = drawingContext.createLinearGradient(
      0,
      50,
      width,
      height - 50 - 120
    );
    gradient.addColorStop(0, color(red(c), blue(c), green(c)));
    gradient.addColorStop(0.5, color(blue(c), green(c), red(c)));
    gradient.addColorStop(1, color(green(c), blue(c), red(c)));
    drawingContext.fillStyle = gradient;

    rect(0, 50, width, height - 50 - 120);
  };
}
