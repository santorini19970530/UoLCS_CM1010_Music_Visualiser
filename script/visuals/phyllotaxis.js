/* this is visual for the garden
 * the idea of tree comes from a Taiwan book names "p5.js 演算創作", ISBN 978-626-324-435-1
 * Chapter 7
 * idea of Turtle is also coming from the same book, but Logo turtle is actually a very old programming language
 * make reference to https://ia600605.us.archive.org/14/items/byte-magazine-1982-08/1982_08_BYTE_07-08_Logo.pdf, P.248
 * */

class Phyllotaxis {
  // private
  #c = 6;
  // 137.5 degrees is the golden angle, so successive dots do not land on the same radius
  #expansionAngle = 137.5;
  #n = 0;
  #dots = [];

  // public
  name = "phyllotaxis";

  // draw the visual
  draw() {
    player.analyse();
    this.drawVarientBackground(color(0, 103, 26));
    this.drawFlower();
    if (this.#dots.length > 5000) this.clearDots();
    this.drawSideTree(width / 4, 100);
    this.drawSideTree((width * 5) / 6, 120);
  }

  drawFlower() {
    push();
    translate(width / 2, height / 2);
    noStroke();

    // making use of fibonacci seriees to make circles in spiral shapes and arrangements
    let alpha = this.#n * this.#expansionAngle;
    let r = this.#c * sqrt(this.#n);
    let x = r * cos(alpha);
    let y = r * sin(alpha);

    this.#dots.push(
      new Dot(
        x,
        y,
        color(
          player.energy("bass"),
          player.energy("mid"),
          player.energy("treble")
        )
      )
    );
    for (let i = this.#dots.length - 1; i >= 0; i--) {
      if (this.#dots[i].isOffScreen()) this.#dots.splice(i, 1);
      else this.#dots[i].draw();
    }
    this.#n++;
    pop();
  };

  drawSideTree(x, length) {
    push();
    translate(x, height - 120);
    rotate(-90);
    this.drawTree(length);
    pop();
  };

  // draw the tree
  // this is recursion, until n = 0
  drawTree(
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
    this.footprint(t.forward(length));

    if (n > 0) {
      // 37 degrees is the spread between the two child branches.
      // Save the turtle, turn for the first branch, then pop so the
      // opposite turn starts from the same point on the trunk.
      t.pushStep();

      t.turn(angle);
      this.drawTree(
        length *
          branchRatio *
          map(player.energy("lowMid"), 0, 255, 0.85, 1.15),
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
          map(player.energy("highMid"), 0, 255, 0.85, 1.15),
        -angle * random(0.95, 1.05),
        branchRatio,
        t,
        n - 1
      );
    }
  };

  // private
  // to prevent too much dots that causing system overload
  clearDots() {
    this.#n = 0;
    for (let i = this.#dots.length - 1; i >= 0; i--) this.#dots.pop();
  }

  footprint({ from, to }) {
    line(from.x, from.y, to.x, to.y);
  }

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
    let variation = map(player.energy(16, 16384), 0, 255, -20, 20);
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
  // private
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
