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
}
