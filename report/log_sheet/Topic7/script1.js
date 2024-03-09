/* new button for volume control */
this.buttons = {
  /* codes for other buttons skipped */
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

/* in controlsAndInput.js */

// responds to keyboard presses, keycode the ascii code of the keypressed
keyPressed = function (keycode) {
  // when number keys are pressed, select the visuals

  switch (keycode) {
    /* codes for other buttons skipped */

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
  }
};

/* in volumeControlButton.js */

// code for drawing out the volume control slider
class VolumeControlDrawStrategy {
  constructor() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.sliderPos = 0.1;
  }

  draw() {
    this.y = height - 80;
    push();
    stroke(255, 246, 224);
    fill(216, 217, 218);
    rect(this.x, this.y, this.width, this.height);
    stroke(97, 103, 122);
    fill(136, 196, 255);
    rect(this.x + this.width * this.sliderPos - 10, this.y - 5, 20, 30);
    pop();
  }

  // update this position when volume changes
  setSliderPos(soundLevel) {
    this.sliderPos = soundLevel;
  }
}
