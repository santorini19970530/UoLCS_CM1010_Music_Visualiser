// music player frame object
// buttons with functions are not mentioned in this file
// the player is divided by upper and lower part
// each part are having each own items to be drawn

class Music_Player_Frame {
  // private
  #upFrame; // this is the binding for the son
  #lowFrame; // this is the binding for the son

  // constructor
  constructor() {
    // bind the frames constructors to the private variables of the parent class
    this.#upFrame = new UpperFrame();
    this.#lowFrame = new LowerFrame();
  }

  //public
  draw = () => {
    this.#upFrame.draw();
    this.#lowFrame.draw();
  };
}

// set up constructors of the frames
// upper frame
const UpperFrame = function () {
  //private
  let frameWidth = divPanel.size().width;
  let frameHeight = 50;
  let fileName = "";

  // draw the school logo and app name
  let drawLogo = () => {
    push();

    image(logo, 5, 5);
    logo.resize(15, 15);
    stroke(0);
    fill(255);
    textSize(16);
    textFont(fontMedium);
    textAlign(LEFT);
    text("MUSIC VISUALISER", 30, 20);
    textAlign(CENTER);
    fileName = soundSource[playingSound].split(/(\\|\/)/g).pop();
    text(fileName, width / 2, 17);
    textAlign(LEFT);

    pop();
  };

  // draw the corner buttons
  let drawCornerButton = () => {
    let characters = ["L", "O", "U"];
    let boxwidth = 15;

    push();

    for (let i = 0; i < characters.length; i++) {
      fill(0);
      stroke(100);
      strokeWeight(1.5);
      rect(width - 5 - boxwidth * (i + 1), 5, boxwidth, boxwidth);
      fill(255);
      noStroke();
      text(characters[i], width - 2.5 - boxwidth * (i + 1), 17.5);
    }

    pop();
  };

  // public
  // draw the upper part
  this.draw = () => {
    background(color(39, 40, 41));
    push();

    fill(color(97, 103, 122));
    rect(0, 0, frameWidth, frameHeight);

    strokeWeight(2);
    stroke(color(50, 50, 50));
    line(0, 25, width, 25);

    pop();

    drawLogo();

    drawCornerButton();
  };
};

// lower framw
const LowerFrame = function () {
  //private
  let frameWidth = divPanel.size().width;
  let frameHeight = 120;
  let timeDisplay = new TimeDisplay(height - frameHeight / 2);

  // public
  // draw the lower frame
  this.draw = () => {
    push();

    fill(color(97, 103, 122));
    rect(0, height - frameHeight, frameWidth, frameHeight);
    timeDisplay.setY(height - frameHeight / 2);
    timeDisplay.draw();

    pop();
  };
};

// for the time of the play
const TimeDisplay = function (y) {
  // private
  let musicCurrentTime;
  let musicDuration;
  let yPos = y;

  // public
  this.draw = () => {
    push();

    strokeWeight(2);
    stroke(255);
    fill(255);
    textSize(20);
    textStyle(BOLD);
    textFont(fontDigit);
    // musicCurrentTime() : returns Number: currentTime of the soundFile in seconds
    musicCurrentTime = sounds[playingSound].currentTime();
    // musicDuration() : returns Number: The duration of the soundFile in seconds
    musicDuration = sounds[playingSound].duration();

    text(
      String("0" + Math.floor(musicCurrentTime / 60)).slice(-2) +
        ":" +
        String("0" + Math.floor(musicCurrentTime % 60)).slice(-2) +
        " / " +
        String("0" + Math.floor(musicDuration / 60)).slice(-2) +
        ":" +
        String("0" + Math.floor(musicDuration % 60)).slice(-2),
      50,
      yPos
    );

    pop();
  };

  this.setY = (y) => {
    yPos = y;
  };
};
