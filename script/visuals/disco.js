/* constructor function for the disco visual */

function Disco() {
  // private
  let cocktailCup = new Cup(
    divPanel.size().width / 2,
    divPanel.size().height - 120,
    divPanel.size().width / 2,
    divPanel.size().height / 2
  );
  let bubbles = []; // bubbles in the cocktail
  let lightPlate = new LightPlate(width / 2, height * 0.2);

  // public
  this.name = "disco";

  // for setup use
  this.setup = function () {
    let range = cocktailCup.cocktail.getCocktailRange();

    for (let i = 0; i < 30; i++)
      bubbles.push(
        new Bubble(
          random(range.x.min, range.x.max),
          random(range.y.min, range.y.max),
          20
        )
      );
  };

  // draw the visual
  this.draw = function () {
    let wave = fourier.waveform();
    let spectrum = fourier.analyze();

    drawVarientBackground();

    cocktailCup.draw();

    // control the movement of bubbles in the cocktail
    let range = cocktailCup.cocktail.getCocktailRange();
    let bubbleAcceleration = map(fourier.getEnergy(16, 32), 0, 255, 1, 5);

    // draw the bubbles in cocktail
    bubbles.forEach((bubble) => {
      let currentPos = bubble.getPosition();

      bubble.draw();

      if (currentPos.y < range.y.max)
        bubble.update(
          currentPos.x,
          currentPos.y + bubbleAcceleration,
          bubble.getRadius()
        );
      else
        bubble.update(
          random(range.x.min, range.x.max),
          range.y.min,
          map(fourier.getEnergy("lowMid"), 0, 255, 19, 35)
        );
    });

    // draw the lyric plate
    lightPlate.draw();
  };

  // make the background looks like near the sun
  // linearGradient is not p5.js function, this is WebAPI function
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

  let drawVarientBackground = function () {
    let gradient = drawingContext.createLinearGradient(
      0,
      50,
      width,
      height - 50 - 120
    );
    gradient.addColorStop(0, color(255, 0, 0));
    gradient.addColorStop(0.5, color(0, 255, 0));
    gradient.addColorStop(1, color(0, 0, 255));
    drawingContext.fillStyle = gradient;

    rect(0, 50, width, height - 50 - 120);
  };
}

// the cocktail cup
class Cup {
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

// light plate for showing lyrics
class LightPlate {
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
      for (
        let column = 1;
        column < this.#loadedTable.getColumnCount();
        column++
      )
        this.#lyrics.push({
          time: this.#loadedTable.getString(row, 0),
          lyric: this.#loadedTable.getString(row, 1),
        });
  }

  // find the current lyrics based on time
  // return the array index if found, or -1 if not found
  currentLyricIndex() {
    // onemore timer is needed to call the lyrics out
    let programTime = millis();
    let currentTime = programTime - fifthVisualTime;

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
    strokeWeight(10);
    stroke(255);
    textSize(this.#fontSize);
    textFont(fontLyrics);
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
    this.#glowFactor[0] += random(map(fourier.getEnergy("mid"), 0, 255, -1, 1));
    this.#glowFactor[1] -= random(
      map(fourier.getEnergy("bass"), 0, 255, -1, 1)
    );
    this.#glowFactor[2] -= random(
      map(fourier.getEnergy("treble"), 0, 255, -1, 1)
    );
  }
}
