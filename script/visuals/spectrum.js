// this is the use of spectrum to simulate North Pole light
// the stars position range are also controled by fourier.analyze()

class Spectrum {
  // private
  #starsAmountMax = 40;
  #stars = [];
  #terrainValues = [];
  #terrainVertexNumbers = { x: 70, y: 40 };
  #terrainMaxHeight = 100;
  #terrainParticleDisplacement = { x: 0.0, y: 0.0 };
  #terrainAmplitude = 0.22;
  #graphics;

  // public
  name = "spectrum";

  // call the spectrum
  setSpectrum() {
    return player.analyse();
  }

  // terrain is built once; stars exist only while a track is playing
  setup() {
    this.#graphics = createGraphics(
      divPanel.size().width,
      divPanel.size().height - 120,
      WEBGL
    );
    this.#graphics.clear();
    this.#graphics.angleMode(DEGREES);
    this.buildTerrain();
  }

  resizeGraphics() {
    this.#graphics.resizeCanvas(
      divPanel.size().width,
      divPanel.size().height - 120
    );
  }

  createStars() {
    for (let i = 0; i < this.#starsAmountMax; i++)
      this.#stars.push(
        new Star(random(0, width), random(50, height - 150), random(5, 10))
      );
  }

  // each column is its own row of noise samples
  buildTerrain() {
    for (let x = 0; x < this.#terrainVertexNumbers.x; x++)
      this.buildTerrainColumn(x);
    this.#terrainParticleDisplacement.x += this.#terrainAmplitude;
  }

  buildTerrainColumn(x) {
    this.#terrainParticleDisplacement.x = 0.0;
    this.#terrainValues.push([]);
    for (let y = 0; y < this.#terrainVertexNumbers.y; y++)
      this.setTerrainVertex(x, y);
  }

  // Neighbouring columns share a noise plane. Stepping y by 0.22 keeps
  // adjacent hills smooth, and the mapped height stays within ±100.
  setTerrainVertex(x, y) {
    this.#terrainValues[x][y] = map(
      noise(
        this.#terrainParticleDisplacement.x,
        this.#terrainParticleDisplacement.y
      ),
      0,
      1,
      -this.#terrainMaxHeight,
      this.#terrainMaxHeight
    );
    this.#terrainParticleDisplacement.y += this.#terrainAmplitude;
  }

  // draw the visual
  draw() {
    const spectrum = this.setSpectrum();
    player.waveform();

    this.drawGradientBackground();
    this.drawStars();
    this.drawLights(spectrum);
    this.drawTerrain(spectrum);
    image(this.#graphics, 0, 0);
  }

  // one energy value moves every star once per frame
  drawStars() {
    if (!player.isPlaying()) {
      this.#stars.length = 0;
      return;
    }
    if (this.#stars.length === 0) this.createStars();

    const energy = player.energy("treble");

    for (let i = 0; i < this.#stars.length; i++) {
      this.#stars[i].draw();
      this.#stars[i].updatePos(
        random(0, width),
        random(map(noise(energy), 0, 1, 50, height - 120)) + 50
      );
    }
  }

  drawLights(spectrum) {
    push();
    noStroke();
    for (let i = 0; i < spectrum.length; i++) this.drawLightColumn(spectrum, i);
    pop();
  };

  drawLightColumn(spectrum, i) {
    let lineX = map(i, 0, spectrum.length, 0, width);
    let lineY = map(spectrum[i], 0, 255, 50, (height - 150) / 2, true);
    let lineColor = color(
      0,
      map(i, 0, spectrum.length, 100, 255),
      map(i, 0, spectrum.length, 100, 255)
    );

    fill(lineColor);
    for (let j = 0; j < 20; j++)
      ellipse(lineX, lineY + 8 * j, map(spectrum[i], 0, 255, 0, 8));
  };

  drawTerrain(spectrum) {
    this.#graphics.clear();
    this.#graphics.push();
    this.#graphics.translate(
      -this.#graphics.width / 2,
      this.#graphics.height / 2 - 520,
      0
    );
    this.#graphics.stroke(color(0, 0, 255));
    this.#graphics.fill(color(0, 30, 200));
    this.#graphics.rotateX(80);

    this.fillTerrainHeights(spectrum);
    this.drawTerrainMesh();

    this.#graphics.pop();
  }

  fillTerrainHeights(spectrum) {
    for (let x = 0; x < this.#terrainVertexNumbers.x; x++)
      this.fillTerrainColumn(x, spectrum);
  }

  fillTerrainColumn(x, spectrum) {
    let spectrumIndex = Math.floor(
      map(x, 0, this.#terrainVertexNumbers.x, 0, spectrum.length)
    );
    let amplitude = spectrum[spectrumIndex];
    let vertexHeight = map(amplitude, 0, 255, 0, this.#terrainMaxHeight);

    for (let y = 0; y < this.#terrainVertexNumbers.y; y++)
      this.#terrainValues[x][y] = vertexHeight;
  }

  drawTerrainMesh() {
    for (let y = 0; y < this.#terrainVertexNumbers.y; y++)
      this.drawTerrainRow(y);
  }

  drawTerrainRow(y) {
    this.#graphics.beginShape(this.#graphics.TRIANGLE_STRIP);
    for (let x = 0; x < this.#terrainVertexNumbers.x; x++) {
      this.#graphics.vertex(x * 50, y * 20, this.#terrainValues[x][y]);
      this.#graphics.vertex(x * 50, (y + 1) * 20, this.#terrainValues[x][y]);
    }
    this.#graphics.endShape();
  }

  // make the background looks like in the North Pole
  // linearGradient is not p5.js function, this is WebAPI function
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
  drawGradientBackground() {
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

  // private
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
