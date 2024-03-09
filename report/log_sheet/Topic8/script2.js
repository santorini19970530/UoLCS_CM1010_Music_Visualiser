/* in phyllotaxis.js */

// simulation of Logo language turtle
class Turtle {
  constructor(x = 0, y = 0, heading = 0) {
    this.coordinateVector = createVector(x, y);
    this.headingVector = createVector(1, 0).rotate(heading);
    this.stateStack = [];
  }

  // return the location of the turtle
  coordinate() {
    return this.coordinateVector.copy();
  }

  // ask the turgle more forward (can backword)
  // return a vector with from and destination coordinates
  forward(length) {
    const from = this.coordinate();
    const v = p5.Vector.mult(this.headingVector, length);

    this.coordinateVector.add(v);
    const to = this.coordinate();

    return { from, to };
  }

  // ask the turtle to turn
  turn(angle) {
    this.headingVector.rotate(angle);
  }

  // store steps into memory stack
  pushStep() {
    this.stateStack.push({
      x: this.coordinateVector.x,
      y: this.coordinateVector.y,
      heading: this.headingVector.heading(),
    });
  }

  // remove from the memory stack the steps
  popStep() {
    const { x, y, heading } = this.stateStack.pop();

    this.coordinateVector.x = x;
    this.coordinateVector.y = y;
    this.headingVector.setHeading(radians(heading));
  }
}

// drawing the tree with the use of turtle
function Phyllotaxis() {
  this,
    (draw = function () {
      /* codes skipped */
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
    });

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
}
