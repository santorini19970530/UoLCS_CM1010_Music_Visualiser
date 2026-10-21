/* this is visual for the garden
 * the idea of tree comes from a Taiwan book names "p5.js 演算創作", ISBN 978-626-324-435-1
 * Chapter 7
 * idea of Turtle is also coming from the same book, but Logo turtle is actually a very old programming language
 * make reference to https://ia600605.us.archive.org/14/items/byte-magazine-1982-08/1982_08_BYTE_07-08_Logo.pdf, P.248
 * */

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

    drawVarientBackground(color(0, 103, 26));

    translate(width / 2, height / 2);
    // draw the tree

    noStroke();
    // making use of fibonacci seriees to make circles in spiral shapes and arrangements
    let alpha = n * expansionAngle;
    let r = c * sqrt(n);
    let x = r * cos(alpha);
    let y = r * sin(alpha);

    dots.push(
      new Dot(
        x,
        y,
        color(
          fourier.getEnergy("bass"),
          fourier.getEnergy("mid"),
          fourier.getEnergy("treble")
        )
      )
    );
    for (let i = dots.length - 1; i >= 0; i--) {
      if (dots[i].isOffScreen()) dots.splice(i, 1);
      else dots[i].draw();
    }
    n++;

    pop();
    if (dots.length > 5000) clearDots();

    // draw the tree on left
    push();
    translate(width / 4, height - 120);
    rotate(-90);
    this.drawTree(100);
    pop();

    // draw the tree on right
    push();
    translate((width * 5) / 6, height - 120);
    rotate(-90);
    this.drawTree(120);
    pop();
  };

  // draw the tree
  // this is recursion, until n = 0
  this.drawTree = function (
    length,
    angle = 37,
    branchRatio = 0.75,
    t = new Turtle(),
    n = 10
  ) {
    // tree body needs to be brown
    if (n == 10 || n == 9) {
      strokeWeight(10);
      stroke(color(140, 103, 62));
    }
    // leaves needs to be green
    else {
      strokeWeight(2);
      stroke(color(9, 255, 0));
    }

    // ask the turtle to move forward (for drawing)
    footprint(t.forward(length));

    if (n > 0) {
      t.pushStep();

      t.turn(angle);
      this.drawTree(
        length *
          branchRatio *
          map(fourier.getEnergy("lowMid"), 0, 255, 0.85, 1.15),
        angle * random(0.95, 1.05),
        branchRatio,
        t,
        n - 1
      );

      t.popStep();

      t.turn(-angle);
      this.drawTree(
        length *
          branchRatio *
          map(fourier.getEnergy("highMid"), 0, 255, 0.85, 1.15),
        -angle * random(0.95, 1.05),
        branchRatio,
        t,
        n - 1
      );
    }
  };

  // private
  // to prevent too much dots that causing system overload
  let clearDots = function () {
    n = 0;
    for (let i = dots.length - 1; i >= 0; i--) dots.pop();
  };

  let footprint = function ({ from, to }) {
    line(from.x, from.y, to.x, to.y);
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
    let variation = map(fourier.getEnergy(16, 16384), 0, 255, -20, 20);
    gradient.addColorStop(
      0,
      color(red(c) + variation, green(c) + variation, blue(c) + variation)
    );
    gradient.addColorStop(0.5, color(red(c) - 50, green(c) - 50, blue(c) - 50));
    gradient.addColorStop(
      1,
      color(red(c) - variation, green(c) - variation, blue(c) - variation)
    );
    drawingContext.fillStyle = gradient;

    rect(0, 50, width, height - 50 - 120);
  };
}

// one flower dot; removed once it leaves the canvas
class Dot {
  constructor(x, y, dotColor) {
    this.x = x;
    this.y = y;
    this.color = dotColor;
  }

  draw() {
    fill(this.color);
    ellipse(this.x, this.y, 10, 10);
  }

  isOffScreen() {
    const screenX = width / 2 + this.x;
    const screenY = height / 2 + this.y;

    return screenX < 0 || screenX > width || screenY < 50 || screenY > height - 120;
  }
}

// simulation of Logo language turtle
// position and heading are restored only by popping the stack
class Turtle {
  #coordinateVector;
  #headingVector;
  #stateStack;

  constructor(x = 0, y = 0, heading = 0) {
    this.#coordinateVector = createVector(x, y);
    this.#headingVector = createVector(1, 0).rotate(heading);
    this.#stateStack = [];
  }

  // return the location of the turtle
  coordinate() {
    return this.#coordinateVector.copy();
  }

  // ask the turgle more forward (can backword)
  // return a vector with from and destination coordinates
  forward(length) {
    const from = this.coordinate();
    const v = p5.Vector.mult(this.#headingVector, length);

    this.#coordinateVector.add(v);
    const to = this.coordinate();

    return { from, to };
  }

  // ask the turtle to turn
  turn(angle) {
    this.#headingVector.rotate(angle);
  }

  // store steps into memory stack
  pushStep() {
    this.#stateStack.push({
      x: this.#coordinateVector.x,
      y: this.#coordinateVector.y,
      heading: this.#headingVector.heading(),
    });
  }

  // remove from the memory stack the steps
  popStep() {
    const step = this.#stateStack.pop();
    if (!step) return;

    this.#coordinateVector.x = step.x;
    this.#coordinateVector.y = step.y;
    this.#headingVector.setHeading(radians(step.heading));
  }
}
