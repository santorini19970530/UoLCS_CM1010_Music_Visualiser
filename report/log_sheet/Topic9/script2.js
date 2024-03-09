/* in spectrum.js */

function Spectrum() {
  // private
  let spectrum;
  let waveform;
  let terrainValues = [];
  let terrainVertexNumbers = { x: 70, y: 40 };
  let terrainMaxHeight = 100;
  let terrainParticleDisplacement = { x: 0.0, y: 0.0 };
  let terrainAmplitude = 0.22;

  /* some codes skipped */
  // for being called by the p5.js setup
  // hence the stars and terrain arrays can be initialised
  this.setup = function () {
    // prepare the terrain vertex array
    for (x = 0; x < terrainVertexNumbers.x; x++) {
      terrainParticleDisplacement.x = 0.0;
      terrainValues.push([]);
      for (y = 0; y < terrainVertexNumbers.y; y++) {
        terrainValues[x][y] = map(
          noise(terrainParticleDisplacement.x, terrainParticleDisplacement.y),
          0,
          1,
          -terrainMaxHeight,
          terrainMaxHeight
        );
        terrainParticleDisplacement.y += terrainAmplitude;
      }
    }
    terrainParticleDisplacement.x += terrainAmplitude;
  };

  // draw the visual
  this.draw = function () {
    /* some codes skipped */
    // draw the 3D terrain
    threeDCanvas.clear();
    threeDCanvas.push();
    threeDCanvas.translate(
      -threeDCanvas.width / 2,
      threeDCanvas.height / 2 - 520,
      0
    );
    threeDCanvas.stroke(color(0, 0, 255));
    threeDCanvas.fill(color(0, 30, 200));
    threeDCanvas.rotateX(80);

    // prepare the terrain vertex array
    for (let x = 0; x < terrainVertexNumbers.x; x++) {
      let spectrumIndex = Math.floor(
        map(x, 0, terrainVertexNumbers.x, 0, spectrum.length)
      );

      let amplitude = spectrum[spectrumIndex];
      let vertexHeight = map(amplitude, 0, 255, 0, terrainMaxHeight);

      for (let y = 0; y < terrainVertexNumbers.y; y++)
        terrainValues[x][y] = vertexHeight;
    }

    // draw the terrain vertex
    for (let y = 0; y < terrainVertexNumbers.y; y++) {
      threeDCanvas.beginShape(TRIANGLE_STRIP);
      for (let x = 0; x < terrainVertexNumbers.x; x++) {
        threeDCanvas.vertex(x * 50, y * 20, terrainValues[x][y]);
        threeDCanvas.vertex(x * 50, (y + 1) * 20, terrainValues[x][y]);
      }
      threeDCanvas.endShape();
    }

    threeDCanvas.pop();
  };
}
