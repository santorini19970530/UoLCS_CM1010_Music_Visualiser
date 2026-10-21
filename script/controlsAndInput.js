/* Constructor function to handle the onscreen menu, keyboard and mouse controls */

class ControlsAndInput {
  constructor() {
    // flag to determine whether to play or pause after button click and to determine which icon to draw
    this.menuDisplayed = false;
    this.playing = false;
    this.trackForVisual = {
      wavepattern: 5,
      needles: 6,
      phyllotaxis: 2,
      disco: 7,
    };

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

  layout() {
    const mid = width / 2;
    const y = height - 80;
    this.buttons.playbackAndPauseButton.place(mid, y, 20, 20);
    this.buttons.fastForwardButton.place(mid + 100, y, 120, 20);
    this.buttons.slowerButton.place(mid - 200, y, 120, 20);
    this.buttons.volumeControlSlider.place(mid + 300, y, 150, 20);
  }

  // keep the volume knob under the pointer while it is dragged along the slider
  dragged = function () {
    return this.buttons.volumeControlSlider.hitCheck();
  };

  // return click checking result
  mousePressed = function () {
    let isPressed = false;

    //check if the buttons have been clicked, if not make the visualisation fullscreen
    if (this.trackHit()) isPressed = true;
    if (this.menuHit()) isPressed = true;

    Object.keys(this.buttons).forEach((key) => {
      if (this.buttons[key].hitCheck()) isPressed = true;
    });

    return isPressed;
  };

  // responds to keyboard presses, keycode the ascii code of the keypressed
  keyPressed = function (keycode) {
    if (keycode >= 49 && keycode <= 57) {
      const visNumber = keycode - 49;
      if (visNumber < vis.visuals.length) this.selectVisualNumber(visNumber);
      return;
    }

    switch (keycode) {
      // space bar - play and pause the music
      case 32:
        if (player.isPlaying()) player.pause();
        else player.startLoop();
        controls.playing = !controls.playing;
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
    this.drawTrackList();

    fill("white");
    stroke("black");
    strokeWeight(2);
    textSize(34);

    // draw the menu if menu displayed is set to true
    if (this.menuDisplayed) {
      push();

      fill(255);
      textSize(16);
      textFont(fontNamed("fontMedium"));
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

  trackLabel(index) {
    return player.pathAt(index).split(/(\\|\/)/g).pop();
  }

  drawTrackList() {
    textSize(14);
    textFont(fontNamed("fontMedium"));
    textAlign(LEFT, TOP);
    noStroke();
    for (let i = 0; i < player.count; i++) {
      if (i === player.index) fill(136, 196, 255);
      else fill(255);
      text(this.trackLabel(i), 16, 70 + i * 22);
    }
  }

  trackHit() {
    textSize(14);
    textFont(fontNamed("fontMedium"));
    for (let i = 0; i < player.count; i++) {
      const y = 70 + i * 22;
      const labelWidth = textWidth(this.trackLabel(i));
      if (mouseX > 16 && mouseX < 16 + labelWidth && mouseY > y && mouseY < y + 18) {
        player.goTo(i);
        return true;
      }
    }
    return false;
  }

  selectVisualNumber(visNumber) {
    const visual = vis.visuals[visNumber];
    vis.selectVisual(visual.name);
    if (!this.playing) return;

    const track = this.trackForVisual[visual.name];
    if (track === undefined || player.index === track) return;

    player.stop();
    player.select(track);
    if (visual.name === "disco") player.markNow();
    player.startLoop();
  }

  menuHit() {
    if (!this.menuDisplayed) return false;

    textSize(16);
    textFont(fontNamed("fontMedium"));
    for (let i = 0; i < vis.visuals.length; i++) {
      const label = i + 1 + " : " + vis.visuals[i].name;
      const x = 150 + 150 * (i + 1);
      const labelWidth = textWidth(label);
      if (mouseX > x && mouseX < x + labelWidth && mouseY > 28 && mouseY < 52) {
        this.selectVisualNumber(i);
        return true;
      }
    }

    return false;
  }

  // private
  // draw out menu items for each visualisation
  #menu() {
    for (let i = 0; i < vis.visuals.length; i++)
      text(i + 1 + " : " + vis.visuals[i].name, 150 + 150 * (i + 1), 45);
  }
}
