/* codes for the 3D terrain */

/* in sketch.js */

function setup() {
  /*
  WEBGL canvas, for the terrain of the first visual 
  source: https://www.youtube.com/watch?v=TaluaAD9MKA
 */
  threeDCanvas = createGraphics(
    divPanel.size().width,
    divPanel.size().height - 120,
    WEBGL
  );
  threeDCanvas.clear();
  threeDCanvas.angleMode(DEGREES);
  threeDCanvas.parent("canvasPanel");

  /* other code skipped */
}
