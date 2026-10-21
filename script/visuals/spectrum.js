// this is the use of spectrum to simulate North Pole light
// the stars position range are also controled by fourier.analyze()

function Spectrum() {
  // private
  let spectrum;
  let waveform;
  const starsAmountMax = 40;
  let stars = [];
  let terrainValues = [];
  let terrainVertexNumbers = { x: 70, y: 40 };
  let terrainMaxHeight = 100;
  let terrainParticleDisplacement = { x: 0.0, y: 0.0 };
  let terrainAmplitude = 0.22;

  // public
  this.name = "spectrum";

  // call the spectrum
  this.setSpectrum = function () {
    spectrum = fourier.analyze();

    return spectrum;
  };

  // for being called by the p5.js setup
  // hence the stars and terrain arrays can be initialised
  this.setup = function () {
    this.createStars();
    this.buildTerrain();
  };

  this.createStars = function () {
    for (let i = 0; i < starsAmountMax; i++)
      stars.push(
        new Star(random(0, width), random(50, height - 150), random(5, 10))
      );
  };

  // each column is its own row of noise samples
  this.buildTerrain = function () {
    for (let x = 0; x < terrainVertexNumbers.x; x++)
      this.buildTerrainColumn(x);
    terrainParticleDisplacement.x += terrainAmplitude;
  };

  this.buildTerrainColumn = function (x) {
    terrainParticleDisplacement.x = 0.0;
    terrainValues.push([]);
    for (let y = 0; y < terrainVertexNumbers.y; y++)
      this.setTerrainVertex(x, y);
  };

  this.setTerrainVertex = function (x, y) {
    terrainValues[x][y] = map(
      noise(terrainParticleDisplacement.x, terrainParticleDisplacement.y),
      0,
      1,
      -terrainMaxHeight,
      terrainMaxHeight
    );
    terrainParticleDisplacement.y += terrainAmplitude;
  };

  // draw the visual
  this.draw = function () {
    spectrum = this.setSpectrum();
    waveform = fourier.waveform();

    drawGradientBackground();
    this.drawStars();
    this.drawLights(spectrum);
    this.drawTerrain(spectrum);
  };

  // one energy value moves every star once per frame
  this.drawStars = function () {
    const energy = fourier.getEnergy("treble");

    for (let i = 0; i < stars.length; i++) {
      stars[i].draw();
      stars[i].updatePos(
        random(0, width),
        random(map(noise(energy), 0, 1, 50, height - 120)) + 50
      );
    }
  };

  this.drawLights = function (spectrum) {
    push();
    noStroke();
    for (let i = 0; i < spectrum.length; i++) this.drawLightColumn(spectrum, i);
    pop();
  };

  this.drawLightColumn = function (spectrum, i) {
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
  };

  this.drawTerrain = function (spectrum) {
    threeDCanvas.clear();
    threeDCanvas.push();
    threeDCanvas.translate(
      -threeDCanvas.width / 2,
      threeDCanvas.height / 2 - 520,
      0
    );
    threeDCanvas.stroke(color(0, 0, 255));
    threeDCanvas.fill(color(0, 30, 200));
    threeDCanvas.rotateX(80);

    this.fillTerrainHeights(spectrum);
    this.drawTerrainMesh();

    threeDCanvas.pop();
  };

  this.fillTerrainHeights = function (spectrum) {
    for (let x = 0; x < terrainVertexNumbers.x; x++)
      this.fillTerrainColumn(x, spectrum);
  };

  this.fillTerrainColumn = function (x, spectrum) {
    let spectrumIndex = Math.floor(
      map(x, 0, terrainVertexNumbers.x, 0, spectrum.length)
    );
    let amplitude = spectrum[spectrumIndex];
    let vertexHeight = map(amplitude, 0, 255, 0, terrainMaxHeight);

    for (let y = 0; y < terrainVertexNumbers.y; y++)
      terrainValues[x][y] = vertexHeight;
  };

  this.drawTerrainMesh = function () {
    for (let y = 0; y < terrainVertexNumbers.y; y++) this.drawTerrainRow(y);
  };

  this.drawTerrainRow = function (y) {
    threeDCanvas.beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < terrainVertexNumbers.x; x++) {
      threeDCanvas.vertex(x * 50, y * 20, terrainValues[x][y]);
      threeDCanvas.vertex(x * 50, (y + 1) * 20, terrainValues[x][y]);
    }
    threeDCanvas.endShape();
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
