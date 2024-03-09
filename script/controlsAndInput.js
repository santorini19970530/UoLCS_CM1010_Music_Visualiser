/* Constructor function to handle the onscreen menu, keyboard and mouse controls */

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

      // sound control slider
      volumeControlSlider: new Button(
        divPanel.size().width / 2 + 300,
        height - 80,
        150,
        20,
        new VolumeControlDrawStrategy(),
        new VolumeControlCheckStrategy()
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

    switch (keycode) {
      // space button - play and pause the music
      case 32:
        if (sound.isPlaying()) sound.pause();
        else {
          sound.loop();
          sound.rate(playSpeed);
        }

        controls.playing = !controls.playing;
        break;

      // number keys - call the visuals
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        let visNumber = keycode - 49;

        try {
          vis.selectVisual(vis.visuals[visNumber].name);

          // some visuals need to play specific songs
          if (this.playing)
            switch (visNumber) {
              case 1:
                if (playingSound != 5) {
                  sound.stop();
                  playingSound = 5;
                  sound = sounds[playingSound];
                  sound.setVolume(playVolume);
                  sound.loop();
                }
                break;
              case 2:
                if (playingSound != 6) {
                  sound.stop();
                  playingSound = 6;
                  sound = sounds[playingSound];
                  sound.setVolume(playVolume);
                  sound.loop();
                }
                break;
              case 3:
                if (playingSound != 2) {
                  sound.stop();
                  playingSound = 2;
                  sound = sounds[playingSound];
                  sound.setVolume(playVolume);
                  sound.loop();
                }
                break;
              case 4:
                if (playingSound != 7) {
                  sound.stop();
                  playingSound = 7;
                  sound = sounds[playingSound];
                  fifthVisualTime = millis();
                  sound.setVolume(playVolume);
                  sound.play(); // just play for one time
                }
                break;
              default:
                break;
            }
        } catch {
          console.error("No such visual");
        }
        break;

      // left button - go back one song
      case 37:
        if (this.playing) {
          sound.stop();
          playingSound =
            playingSound > 0 ? playingSound - 1 : sounds.length - 1;
          sound = sounds[playingSound];
          sound.loop();
          sound.rate(playSpeed);
          sound.setVolume(0.1);
        }
        break;

      // right button - go forward one song
      case 39:
        if (this.playing) {
          sound.stop();
          playingSound =
            playingSound < sounds.length - 1 ? playingSound + 1 : 0;
          sound = sounds[playingSound];
          sound.loop();
          sound.rate(playSpeed);
          sound.setVolume(playVolume);
        }
        break;

      // "f" button (no shift) - play the music faster
      case 70:
        playSpeed += 0.1;
        if (sound.isPlaying()) sound.rate(playSpeed);
        break;

      // "s" button (no shift) - play the music slower
      case 83:
        playSpeed -= 0.1;
        if (sound.isPlaying()) sound.rate(playSpeed);
        break;

      // "m" button (no shift) - show the menu
      case 77:
        this.menuDisplayed = !this.menuDisplayed;
        break;

      // up button - make the volume louder
      case 38:
        playVolume += 0.1;
        if (playVolume > 1.0) playVolume = 1.0;
        controls.buttons.volumeControlSlider.drawStrategy.setSliderPos(
          playVolume
        );
        sound.setVolume(playVolume);

        break;

      // down button - make the volume quieter
      case 40:
        playVolume -= 0.1;
        if (playVolume <= 0.1) playVolume = 0.1;
        controls.buttons.volumeControlSlider.drawStrategy.setSliderPos(
          playVolume
        );
        sound.setVolume(playVolume);
        break;

      // default: other keys do nothing
      default:
        break;
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
