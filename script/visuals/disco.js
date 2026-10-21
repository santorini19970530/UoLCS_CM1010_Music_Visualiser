/* constructor function for the disco visual */

class Disco {
  // private
  #cocktailCup;
  #bubbles = [];
  #lightPlate;
  #discoBackground;

  // public
  name = "disco";

  constructor() {
    this.#cocktailCup = new Cup(
      divPanel.size().width / 2,
      divPanel.size().height - 120,
      divPanel.size().width / 2,
      divPanel.size().height / 2
    );
    this.#lightPlate = new LightPlate(width / 2, height * 0.2);
    this.#discoBackground = new DiscoBackground();
  }

  spawnBubbles() {
    let range = this.#cocktailCup.cocktail.getCocktailRange();

    for (let i = 0; i < 30; i++)
      this.#bubbles.push(
        new Bubble(
          random(range.x.min, range.x.max),
          random(range.y.min, range.y.max),
          30
        )
      );
  }

  // draw the visual
  draw() {
    player.waveform();
    player.analyse();
    this.#discoBackground.draw();
    this.#cocktailCup.draw();
    this.drawBubbles();
    this.#lightPlate.draw();
  }

  drawBubbles() {
    if (!player.isPlaying()) {
      this.#bubbles.length = 0;
      return;
    }
    if (this.#bubbles.length === 0) this.spawnBubbles();

    let range = this.#cocktailCup.cocktail.getCocktailRange();
    let bubbleAcceleration = map(player.energy(16, 32), 0, 255, 1, 5);

    for (let i = this.#bubbles.length - 1; i >= 0; i--) {
      let bubble = this.#bubbles[i];
      let currentPos = bubble.getPosition();

      bubble.draw();

      // bubbles can float some part on water surface
      if (currentPos.y < range.y.max - 5)
        bubble.update(
          currentPos.x,
          currentPos.y + bubbleAcceleration,
          bubble.getRadius()
        );
      else {
        this.#bubbles.splice(i, 1);
        this.#bubbles.push(
          new Bubble(
            random(range.x.min, range.x.max),
            range.y.min + 5,
            map(player.energy("lowMid"), 0, 255, 19, 30)
          )
        );
      }
    }
  }
}

// the cocktail cup
class Cup {
  // private
  #position;
  #width;
  #height;

  constructor(posX, posY, width, height) {
    this.#position = { x: posX - width / 2, y: posY - height };
    this.#width = width;
    this.#height = height;
    this.cocktail = new Cocktail(
      divPanel.size().width / 2,
      divPanel.size().height - 120,
      divPanel.size().width / 2,
      divPanel.size().height / 2
    );
  }

  // draw the cup
  draw() {
    push();
    translate(this.#position.x, this.#position.y);
    noFill();
    stroke(10);
    strokeWeight(5);

    // cup top part
    beginShape();
    vertex(this.#width * 0.3 - 25, -50);
    vertex(this.#width * 0.4, (this.#height * 3) / 4 - 50);
    vertex(this.#width * 0.6, (this.#height * 3) / 4 - 50);
    vertex(this.#width * 0.7 + 25, -50);
    endShape(CLOSE);

    // cup middle part
    rect(
      this.#width * 0.48,
      (this.#height * 3) / 4 - 50,
      this.#width * 0.04,
      200
    );

    // cup lower part
    beginShape();
    vertex(this.#width * 0.4, (this.#height * 3) / 4 + 180);
    vertex(this.#width * 0.45, (this.#height * 3) / 4 + 150);
    vertex(this.#width * 0.55, (this.#height * 3) / 4 + 150);
    vertex(this.#width * 0.6, (this.#height * 3) / 4 + 180);
    endShape(CLOSE);

    pop();

    // draw the cocktail liquid
    this.cocktail.draw();
  }
}

// cocktail liquid
class Cocktail {
  // private
  #position;
  #width;
  #height;

  constructor(posX, posY, width, height) {
    this.#position = { x: posX - width / 2, y: posY - height };
    this.#width = width;
    this.#height = height;
  }

  // return the range that the bubble can move
  getCocktailRange() {
    return {
      x: {
        min: divPanel.size().width / 2 - 100,
        max: divPanel.size().width / 2 + 100,
      },
      y: {
        min: this.#position.y,
        max: (divPanel.size().height * 3) / 4,
      },
    };
  }

  // draw the liquid
  draw() {
    push();
    translate(this.#position.x, this.#position.y);
    fill(color(255, 174, 196));
    noStroke();

    beginShape();
    vertex(this.#width * 0.3, 0);
    vertex(this.#width * 0.4, (this.#height * 3) / 4 - 50);
    vertex(this.#width * 0.6, (this.#height * 3) / 4 - 50);
    vertex(this.#width * 0.7, 0);
    endShape(CLOSE);

    pop();
  }
}

// bubble in the cocktail drinking
class Bubble {
  // private
  #position;
  #radius;

  constructor(x, y, radius) {
    this.#position = { x: x, y: y };
    this.#radius = radius;
  }

  // draw the bubble
  draw() {
    push();
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(this.#position.x, this.#position.y, this.#radius, this.#radius);
    pop();
  }

  // update bubble position
  update(x, y, radius = 20) {
    this.#position = { x: x, y: y };
    this.#radius = radius;
  }

  // return bubble position
  getPosition() {
    return this.#position;
  }

  // return bubble radius
  getRadius() {
    return this.#radius;
  }
}

// one timed line from the lyric table
class Lyric {
  constructor(time, text) {
    this.time = time;
    this.lyric = text;
  }
}

// light plate for showing lyrics
class LightPlate {
  // private
  #position;
  #glow = function (glowColor, blurriness) {
    drawingContext.shadowBlur = blurriness;
    drawingContext.shadowColor = glowColor;
  };
  #lyrics = [];
  #loadedTable;
  #fontSize;
  #glowFactor = [];

  constructor(x, y) {
    this.#loadedTable = loadTable("../assets/lyric.csv", "csv", () =>
      this.onFileload()
    );
    this.#position = { x: x, y: y };
    this.#fontSize = 120;
    this.#glowFactor = [400, 80, 12];
  }

  // load in lyrics from csv file
  onFileload() {
    for (let row = 1; row < this.#loadedTable.getRowCount(); row++)
      this.readLyricRow(row);
  }

  readLyricRow(row) {
    for (
      let column = 1;
      column < this.#loadedTable.getColumnCount();
      column++
    )
      this.addLyricEntry(row, column);
  }

  addLyricEntry(row, column) {
    this.#lyrics.push(
      new Lyric(
        this.#loadedTable.getString(row, 0),
        this.#loadedTable.getString(row, column)
      )
    );
  }

  // lyric.csv stores each line's start in milliseconds.
  // player.elapsed() is the time since this visual was selected, so the lyric
  // clock follows the song rather than the time since the page loaded.
  // return the array index if found, or -1 if not found
  currentLyricIndex() {
    let currentTime = player.elapsed();

    for (let i = this.#lyrics.length - 1; i >= 0; i--)
      if (currentTime >= this.#lyrics[i].time) return i;

    return -1; // No lyric should be displayed
  }

  // draw the lyrics with respect to the lyric number
  draw() {
    let lyricIndex = this.currentLyricIndex();

    if (lyricIndex !== -1) {
      this.loadLyric(this.#lyrics[lyricIndex].lyric);
      this.update();
    }
  }

  // text shadowing
  // source: https://www.youtube.com/watch?v=iIWH3IUYHzM
  loadLyric(lyric) {
    push();

    //translate(this.#position.x, this.#position.y);
    noFill();
    strokeWeight(7);
    stroke(255);
    textSize(this.#fontSize);
    textFont(fontFiles.keys("fontLyrics"));
    textAlign(CENTER, CENTER);

    for (let i = 0; i < 6; i++) {
      switch (i) {
        case 0:
        case 1:
          this.#glow(color(332, 58, 91, 100), this.#glowFactor[0]);
          break;
        case 2:
        case 3:
          this.#glow(color(332, 58, 91, 100), this.#glowFactor[1]);
          break;
        default:
          this.#glow(color(332, 58, 91, 100), this.#glowFactor[2]);
      }
      text(lyric, this.#position.x, this.#position.y);
    }
    pop();
  }

  // update the lyrics' backuplight glow w.r.t. music energy in specific range
  update() {
    this.#glowFactor[0] += random(map(player.energy("mid"), 0, 255, -1, 1));
    this.#glowFactor[1] -= random(
      map(player.energy("bass"), 0, 255, -1, 1)
    );
    this.#glowFactor[2] -= random(
      map(player.energy("treble"), 0, 255, -1, 1)
    );
  }
}

// make the background looks like near the sun
// linearGradient is not p5.js function, this is WebAPI function
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
class DiscoBackground {
  // private
  #position;
  #colorSpectrumDivider;
  #redFactor;
  #blueFactor;
  #greenFactor;

  constructor() {
    this.#position = { x: 0, y: 50 };
    this.#colorSpectrumDivider = 0.5;
    this.#redFactor = 255;
    this.#blueFactor = 255;
    this.#greenFactor = 255;
  }

  // draw the background
  async draw() {
    let gradient = drawingContext.createLinearGradient(
      this.#position.x,
      this.#position.y,
      width,
      height - 50 - 120
    );

    gradient.addColorStop(0, color(this.#redFactor, 0, 0));
    gradient.addColorStop(
      this.#colorSpectrumDivider,
      color(0, this.#greenFactor, 0)
    );
    gradient.addColorStop(1, color(0, 0, this.#blueFactor));

    drawingContext.fillStyle = gradient;
    rect(this.#position.x, this.#position.y, width, height - 50 - 120);

    // await for sequencing the processes
    let resultRed = await this.changeRed();
    let resultBlue = await this.changeBlue();
    let resultGreen = await this.changeGreen();
    let result = await this.changeSpectrum();
  }

  // promise part
  changeSpectrum() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.#colorSpectrumDivider = map(
          player.energy("mid"),
          0,
          255,
          0.2,
          0.8
        );
        resolve();
      }, 5000);
    });
  }

  changeRed() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.#redFactor = map(
          noise(player.energy("lowMid")),
          0,
          1,
          200,
          255
        );
        resolve();
      }, 2000);
    });
  }

  changeBlue() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.#blueFactor = map(
          noise(player.energy("highMid")),
          0,
          1,
          200,
          255
        );
        resolve();
      }, 3000);
    });
  }

  changeGreen() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.#greenFactor = map(
          noise(player.energy(16, 32)),
          0,
          1,
          210,
          255
        );
        resolve();
      }, 4000);
    });
  }
}
