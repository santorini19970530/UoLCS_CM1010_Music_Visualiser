// this is the simulation of sun
// two waveform tracks and many particles are being used
// the waveform tracks are opposite to each other
// the particles will come out to the screen (with speed controlled by "base sound" amplitude)
// color are controlled by getEnergy() return values

//draw the waveform to the screen
class WavePattern {
  // private
  #particles = [];

  // public
  name = "wavepattern";

  // draw the wave form to the screen
  // to make this as circular shape, not only circle but also beginShape + endShape + vertex can do this
  draw() {
    let wave = player.waveform();
    player.analyse();

    this.drawWarmBackground();

    push();
    translate(width / 2, height / 2);
    this.drawWaveRing(wave, 300, color(209, 64, 9), false);
    this.drawWaveRing(wave, 150, color(252, 150, 1), true);
    this.drawParticles();
    pop();
  }

  drawParticles() {
    if (!player.isPlaying()) {
      this.#particles.length = 0;
      return;
    }

    let particleColor = color(
      map(player.energy("lowMid"), 0, 255, 209, 255),
      map(player.energy("mid"), 0, 255, 64, 255),
      map(player.energy("highMid"), 0, 255, 9, 255)
    );

    for (let i = 0; i < 10; i++)
      this.#particles.push(new Particle(300 + 10, particleColor));

    for (let i = this.#particles.length - 1; i >= 0; i--) {
      if (this.#particles[i].isBoundry()) this.#particles.splice(i, 1);
      else {
        this.#particles[i].draw();
        this.#particles[i].update(particleColor, player.energy("bass") > 180);
      }
    }
  }

  // wave samples cover 0-180 degrees, so each ring is drawn twice for a full circle
  drawWaveRing(wave, radius, ringColor, reverse) {
    strokeWeight(8);
    noFill();
    stroke(ringColor);
    for (let half = -1; half <= 1; half += 2)
      this.drawWaveHalf(wave, radius, half, reverse);
  };

  drawWaveHalf(wave, radius, half, reverse) {
    beginShape();
    for (let alpha = 0; alpha <= 180; alpha++) {
      let i = floor(map(alpha, 0, 180, 0, wave.length - 1));
      let rOffset = map(wave[i], -0.2, 0.2, -100, 100);
      let angle = reverse ? 180 - alpha : alpha;
      let x = (radius + rOffset) * cos(angle);
      let y = (radius + rOffset) * sin(angle) * half;

      vertex(x, y);
    }
    endShape();
  };

  // make the background looks like near the sun
  // RadialGradient is not p5.js function, this is WebAPI function
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient

  drawWarmBackground() {
    let gradient = drawingContext.createRadialGradient(
      width / 2,
      height / 2,
      60,
      width / 2,
      height / 2,
      height / 2
    );
    gradient.addColorStop(0, color(238, 93, 95));
    gradient.addColorStop(0.05, color(231, 126, 110));
    gradient.addColorStop(0.1, color(231, 62, 101));
    gradient.addColorStop(0.15, color(146, 0, 4));
    gradient.addColorStop(1, color(90, 6, 0));
    drawingContext.fillStyle = gradient;

    rect(0, 50, width, height - 50 - 120);
  };
}

// Particle class
class Particle {
  // private
  #position;
  #velocity;
  #acceleration;
  #color;

  // public
  constructor(radius, color) {
    this.#position = p5.Vector.random2D().mult(radius);
    this.#velocity = createVector(0, 0);
    this.#acceleration = this.#position.copy().mult(random(0.0001, 0.0005));
    this.#color = color;
  }

  // draw one particle
  draw() {
    noStroke();
    fill(this.#color);
    ellipse(this.#position.x, this.#position.y, 8, 8);
  }

  // update position, color and acceleration of one particle
  update(color, isBass) {
    this.#acceleration = isBass
      ? this.#position.copy().mult(random(0.001, 0.0015))
      : this.#position.copy().mult(random(0.0001, 0.0005));
    this.#velocity.add(this.#acceleration);
    this.#position.add(this.#velocity);
    this.#color = color;
  }

  // returns if one particle has reached bounday of the canvas
  isBoundry() {
    if (
      this.#position.x < -width / 2 ||
      this.#position.x > width / 2 ||
      this.#position.y > height / 2 - 120 ||
      this.#position.y < -height / 2 + 50
    )
      return true;
    return false;
  }
}
