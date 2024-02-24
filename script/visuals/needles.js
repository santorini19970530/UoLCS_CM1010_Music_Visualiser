// constructor function to draw the status bars (originally needles)

function Needles() {
  // private
  // how large is the arc of the needle plot.
  let radius = 100;
  let energy;

  // public
  this.name = "needles";

  //frquencies used by the energyfunction to retrieve a value for each plot
  this.frequencyBins = ["bass", "lowMid", "mid", "highMid", "treble"];
  this.rainbow = [
    color(255, 26, 26),
    color(255, 255, 26),
    color(26, 26, 255),
    color(181, 77, 255),
    color(254, 254, 254),
  ];

  // draw the plots to the screen
  this.draw = function () {
    // create an array amplitude values from the fft.
    let spectrum = fourier.analyze();

    push();

    translate(width / 2, height / 2);
    for (let i = 0; i < this.rainbow.length; i++) {
      energy = fourier.getEnergy(this.frequencyBins[i]);
      let maxAngle = map(energy, 0, 255, 0, 360);
      for (let alpha = 0; alpha <= maxAngle; alpha++) {
        fill(this.rainbow[i]);
        let r = radius + i * 30;
        let rOffset = 0;
        let x = r * cos(alpha - 90) + rOffset;
        let y = (r + rOffset) * sin(alpha - 90);
        ellipse(x, y, 15);
      }
    }

    pop();

    ticks();
  };

  // private method()
  // draw the graph ticks on an indivisual plot
  let ticks = function () {
    let tickRadius = radius - 20;
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
        stroke(color(255, 255, 255));
        strokeWeight(2);
        fill(color(254, 254, 254));
        textFont(fontDigit);
        textSize(15);
        text(String(Math.floor(map(alpha, 0, 360, 0, 255))), x, y);
        pop();
      }
    }

    pop();
  };
}
