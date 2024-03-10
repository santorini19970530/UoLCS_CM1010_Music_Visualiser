/* in disco.js */

class DiscoBackground {
  // factors of the color digits
  #color_spectrum_divider;
  #red_factor;
  #blue_factor;
  #green_factor;

  constructor() {
    this.#color_spectrum_divider = 0.5;
    this.#red_factor = 255;
    this.#blue_factor = 255;
    this.#green_factor = 255;
  }

  // draw the background
  async draw() {
    let gradient = drawingContext.createLinearGradient(
      this.#position.x,
      this.#position.y,
      width,
      height - 50 - 120
    );

    gradient.addColorStop(0, color(this.#red_factor, 0, 0));
    gradient.addColorStop(
      this.#color_spectrum_divider,
      color(0, this.#green_factor, 0)
    );
    gradient.addColorStop(1, color(0, 0, this.#blue_factor));

    drawingContext.fillStyle = gradient;
    rect(this.#position.x, this.#position.y, width, height - 50 - 120);

    // await for sequencing the processes
    let result_red = await this.changeRed();
    let result_blue = await this.changeBlue();
    let result_green = await this.changeGreen();
    let result = await this.changeSpectrum();
  }

  // promise part
  changeSpectrum() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.#color_spectrum_divider = map(
          fourier.getEnergy("mid"),
          0,
          255,
          0.2,
          0.8
        );
        resolve();
      }, 5000);
    });
  }

  // below three functions are the same logic as changeSpectrum, so skip the code
  changeRed() {}

  changeBlue() {}

  changeGreen() {}
}
