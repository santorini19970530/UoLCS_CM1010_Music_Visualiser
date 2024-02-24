//Constructor function to handle the onscreen menu, keyboard and mouse controls

class ControlsAndInput {
  constructor() {
    // flag to determine whether to play or pause after button click and to determine which icon to draw
    this.menuDisplayed = false;
    this.playing = false;

    // arrays of buttons
    this.buttons = {
      // playback button displayed in the middle bottom part of the playser
      playbackAndPauseButton: new Button(
        divPanel.size().width / 2,
        height - 80,
        20,
        20,
        new PlaybackAndPauseDrawStrategy(),
        new PlaybackAndPauseHitCheckStrategy()
      ),
      // playspeed buttons displayed in both side of th playback button
      fastForwardButton: new Button(
        divPanel.size().width / 2 + 100,
        height - 80,
        120,
        20,
        new PlaySpeedDrawStrategy("faster"),
        new PlaySpeedHitChcekStrategy("faster")
      ),
      slowerButton: new Button(
        divPanel.size().width / 2 - 200,
        height - 80,
        120,
        20,
        new PlaySpeedDrawStrategy("slower"),
        new PlaySpeedHitChcekStrategy("slower")
      ),
      louderButton: new Button(
        divPanel.size().width / 2 + 400,
        height - 70,
        30,
        30,
        new VolumeControlDrawStrategy("up"),
        new VolumeControlCheckStrategy("up")
      ),
      quieterButton: new Button(
        divPanel.size().width / 2 + 300,
        height - 70,
        30,
        30,
        new VolumeControlDrawStrategy("down"),
        new VolumeControlCheckStrategy("down")
      ),
    };
  }

  // return click checking result
  mousePressed = function () {
    let isPressed = false;

    //check if the buttons have been clicked, if not make the visualisation fullscreen
    Object.keys(this.buttons).forEach((key) => {
      if (this.buttons[key].hitCheck()) isPressed = true;
    });

    return isPressed;
  };

  // responds to keyboard presses, keycode the ascii code of the keypressed
  keyPressed = function (keycode) {
    // when number keys are pressed, select the visuals
    if (keycode > 48 && keycode < 58) {
      var visNumber = keycode - 49;
      vis.selectVisual(vis.visuals[visNumber].name);
    }

    // right button - go forward one song
    if (keycode == 39) {
      if (this.playing) {
        sound.stop();
        playingSound = playingSound < sounds.length - 1 ? playingSound + 1 : 0;
        sound = sounds[playingSound];
        sound.loop();
        sound.rate(playSpeed);
        sound.setVolume(playVolume);
      }
    }

    // left button - go back one song
    if (keycode == 37) {
      if (this.playing) {
        sound.stop();
        playingSound = playingSound > 0 ? playingSound - 1 : sounds.length - 1;
        sound = sounds[playingSound];
        sound.loop();
        sound.rate(playSpeed);
        sound.setVolume(0.1);
      }
    }

    // space button - show the menu
    if (keycode == 32) {
      this.menuDisplayed = !this.menuDisplayed;
    }
  };

  //draws the playback button and potentially the menu
  draw = function () {
    push();

    fill("white");
    stroke("black");
    strokeWeight(2);
    textSize(34);

    // draw the menu if menu displayed is set to true
    if (this.menuDisplayed) {
      push();

      fill(255);
      textSize(16);
      textFont(fontMedium);
      text("Select a visualisation:", 40, 45);
      this.#menu();
      image(logo2, 150 + 150 * (vis.visuals.length + 1), 30);
      logo2.resize(15, 15);

      pop();
    }

    // draw each buttons
    Object.keys(this.buttons).forEach((key) => {
      this.buttons[key].draw();
    });

    pop();
  };

  // private
  // draw out menu items for each visualisation
  #menu() {
    for (let i = 0; i < vis.visuals.length; i++)
      text(i + 1 + " : " + vis.visuals[i].name, 150 + 150 * (i + 1), 45);
  }
}
