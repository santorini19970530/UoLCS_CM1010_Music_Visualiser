// this is the use of spectrum to simulate North Pole light
// the stars position range are also controled by fourier.analyze()

function Spectrum() {
  // private
  let spectrum;

  // public
  this.name = "spectrum";

  this.setSpectrum = function () {
    spectrum = fourier.analyze();

    return spectrum;
  };

  // draw the visual
  this.draw = function () {
    spectrum = this.setSpectrum();

    drawGradientBackground();

    drawMountain();

    stars.forEach((star) => {
      star.draw();
      spectrum.forEach((frequency) => {
        star.updatePos(
          random(0, width),
          random(map(noise(spectrum[frequency]), 0, 1, 50, height - 120)) + 50
        );
      });
    });

    push();
    noStroke();
    // make the lights
    for (let i = 0; i < spectrum.length; i++) {
      let lineX = map(i, 0, spectrum.length, 0, width);
      let lineY = map(spectrum[i], 0, 255, 50, (height - 150) / 2, true);

      let line_color = color(
        0,
        map(i, 0, spectrum.length, 100, 255),
        map(i, 0, spectrum.length, 100, 255)
      );
      fill(line_color);
      for (let j = 0; j < 20; j++)
        ellipse(lineX, lineY + 8 * j, map(spectrum[i], 0, 255, 0, 8));
    }
    pop();
  };

  // draw the mountain
  let drawMountain = function () {
    mountains.forEach((mountain) => {
      mountain.draw();
    });
  };

  // make the background looks like in the North Pole
  // linearGradient is not p5.js function, this is WebAPI function
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

  let drawGradientBackground = function () {
    let gradient = drawingContext.createLinearGradient(
      0,
      50,
      width,
      height - 50 - 120
    );
    gradient.addColorStop(0, color(0, 20, 16));
    gradient.addColorStop(1, color(18, 39, 107));
    drawingContext.fillStyle = gradient;

    rect(0, 50, width, height - 50 - 120);
  };
}

// star class
// a star is just a circle covered by two lines (in cross shape)
class Star {
  // private
  #origin;
  #center;
  #oppositeCorner;
  #size;
  #starColor;

  // public
  constructor(x, y, size) {
    this.#size = Math.max(size, 10);
    this.#origin = createVector(x - this.#size / 2, y - this.#size / 2);
    this.#center = createVector(x, y);
    this.#oppositeCorner = createVector(x + this.#size / 2, y + this.#size / 2);
    this.#starColor = color(255, 255, 255, Math.floor(random(0, 256)));
  }

  // draw a star
  draw() {
    push();

    strokeWeight(1);
    stroke(this.#starColor);
    fill(this.#starColor);
    ellipse(this.#center.x, this.#center.y, this.#size * 0.5, this.#size * 0.5);
    line(
      this.#origin.x + this.#size,
      this.#origin.y,
      this.#oppositeCorner.x - this.#size,
      this.#oppositeCorner.y
    );
    line(
      this.#origin.x,
      this.#origin.y,
      this.#oppositeCorner.x,
      this.#oppositeCorner.y
    );

    pop();
  }

  // update the star position
  updatePos(newX, newY) {
    this.#updatePosX(newX);
    this.#updatePosY(newY);
  }

  // private methods
  #updatePosX(newX) {
    this.#origin.x = newX - this.#size / 2;
    this.#oppositeCorner.x = newX + this.#size / 2;
    this.#center.x = newX;
  }

  #updatePosY(newY) {
    this.#origin.y = newY - this.#size / 2;
    this.#oppositeCorner.y = newY + this.#size / 2;
    this.#center.y = newY;
  }
}

// same Mountain class as ITP1 game project
class Mountain {
  #x;
  #y;
  #width;
  #height;

  constructor(x, y, size) {
    this.#x = x;
    this.#y = y;
    this.#width = Math.max(size, 100);
    this.#height = (this.#width * 2) / 3; // ratio between width and height
  }

  draw() {
    fill(color(28, 47, 49));
    triangle(
      this.#x,
      this.#y,
      this.#x + this.#width,
      this.#y,
      this.#x + this.#width / 2,
      this.#y - this.#height
    );

    fill(191, 191, 191);
    beginShape(TESS);
    vertex(this.#x + this.#width / 2, this.#y - this.#height);
    vertex(
      this.#x + (this.#width * 19) / 30,
      this.#y - (this.#height * 147) / 200
    );
    vertex(
      this.#x + (this.#width * 17) / 30,
      this.#y - (this.#height * 157) / 200
    );
    vertex(
      this.#x + (this.#width * 16) / 30,
      this.#y - (this.#height * 143) / 200
    );
    vertex(
      this.#x + (this.#width * 14) / 30,
      this.#y - (this.#height * 153) / 200
    );
    vertex(
      this.#x + (this.#width * 13) / 30,
      this.#y - (this.#height * 130) / 200
    );
    vertex(
      this.#x + (this.#width * 106) / 300,
      this.#y - (this.#height * 141) / 200
    );
    vertex();
    endShape();

    noStroke();
  }
}
