/* in needles.js */

function Needles() {
  /* code skipped */
  // frquencies used by the energyfunction to retrieve a value for each plot
  // human detectable sound frequencies are ranged between 16Hz and 32,768 Hz
  // 16,384 Hz - 32,768 Hz are too high that not included in the songs
  // hence i use the other ranges to divide into seven ranges for illustrating rainbow visual
  this.frequencyBins = [
    { lower: 16, upper: 32 },
    { lower: 32, upper: 280 },
    { lower: 280, upper: 512 },
    { lower: 512, upper: 2048 },
    { lower: 2048, upper: 8192 },
    { lower: 8192, upper: 12288 },
    { lower: 12288, upper: 16384 },
  ];
  this.rainbow = [
    color(255, 26, 26),
    color(265, 165, 0),
    color(255, 255, 26),
    color(0, 200, 0),
    color(0, 194, 222),
    color(0, 65, 141),
    color(95, 40, 211),
  ];

  // draw the plots to the screen
  this.draw = function () {
    /* code skipped */
    // create an array amplitude values from the fft.
    let spectrum = fourier.analyze();

    for (let i = 0; i < this.rainbow.length; i++) {
      // getEnergy with two digit variables will get averaged amplitude of range of sound frequencies
      energy = fourier.getEnergy(
        this.frequencyBins[i].lower,
        this.frequencyBins[i].upper
      );
    }
    /* code skipped */
  };
}
