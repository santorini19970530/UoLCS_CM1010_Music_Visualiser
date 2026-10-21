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
        new PlaySpeedHitCheckStrategy("faster")
      ),

      slowerButton: new Button(
        divPanel.size().width / 2 - 200,
        height - 80,
        120,
        20,
        new PlaySpeedDrawStrategy("slower"),
        new PlaySpeedHitCheckStrategy("slower")
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

  // keep the volume knob under the pointer while it is dragged along the slider
  dragged = function () {
    return this.buttons.volumeControlSlider.hitCheck();
  };

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
      // space bar - play and pause the music
      case 32:
        if (player.isPlaying()) player.pause();
        else player.startLoop();
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
                if (player.index != 5) {
                  player.stop();
                  player.select(5);
                  player.startLoop();
                }
                break;
              case 2:
                if (player.index != 6) {
                  player.stop();
                  player.select(6);
                  player.startLoop();
                }
                break;
              case 3:
                if (player.index != 2) {
                  player.stop();
                  player.select(2);
                  player.startLoop();
                }
                break;
              case 4:
                if (player.index != 7) {
                  player.stop();
                  player.select(7);
                  player.markNow();
                  player.startOnce();
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
      case 37: {
        const previous = player.index > 0 ? player.index - 1 : player.count - 1;
        player.goTo(previous);
        break;
      }

      // right button - go forward one song
      case 39: {
        const next = player.index < player.count - 1 ? player.index + 1 : 0;
        player.goTo(next);
        break;
      }

      // "f" button (no shift) - play the music faster
      case 70:
        player.speed += 0.1;
        break;

      // "s" button (no shift) - play the music slower
      case 83:
        player.speed -= 0.1;
        break;

      // "m" button (no shift) - show the menu
      case 77:
        this.menuDisplayed = !this.menuDisplayed;
        break;

      // up button - make the volume louder
      case 38:
        player.volume = Math.min(1, player.volume + 0.1);
        controls.buttons.volumeControlSlider.drawStrategy.setSliderPos(
          player.volume
        );
        break;

      // down button - make the volume quieter
      case 40:
        player.volume = Math.max(0.1, player.volume - 0.1);
        controls.buttons.volumeControlSlider.drawStrategy.setSliderPos(
          player.volume
        );
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
      textFont(fontFiles.keys("fontMedium"));
      text("Select a visualisation:", 40, 45);
      this.#menu();
      image(logo2, 150 + 150 * (vis.visuals.length + 1), 30, 15, 15);

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
