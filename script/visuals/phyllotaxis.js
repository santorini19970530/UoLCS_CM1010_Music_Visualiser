// making use of fibonacci seriees to make circles in spiral shapes and arrangements

function Phyllotaxis() {
  // private
  let c = 6;
  let expansionAngle = 137.5;
  let n = 0;
  let dots = [];

  // public
  this.name = "phyllotaxis";

  // draw the visual
  this.draw = function () {
    let spectrum = fourier.analyze();

    drawVarientBackground(
      color(fourier.getEnergy("lowMid"), 100, fourier.getEnergy("highMid"))
    );

    push();

    translate(width / 2, height / 2);
    noStroke();
    let alpha = n * expansionAngle;
    let r = c * sqrt(n);
    let x = r * cos(alpha);
    let y = r * sin(alpha);

    dots.push({
      x: x,
      y: y,
      color: color(
        fourier.getEnergy("bass"),
        fourier.getEnergy("mid"),
        fourier.getEnergy("treble")
      ),
    });
    dots.forEach((dot) => {
      fill(dot.color);
      ellipse(dot.x, dot.y, 10, 10);
    });
    n++;

    pop();

    if (dots.length > 5000) clearDots();
  };

  // private
  // to prevent too much dots that causing system overload
  let clearDots = function () {
    n = 0;
    for (let i = dots.length - 1; i >= 0; i--) dots.pop();
  };

  // make the background looks like near the sun
  // linearGradient is not p5.js function, this is WebAPI function
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

  let drawVarientBackground = function (c) {
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
