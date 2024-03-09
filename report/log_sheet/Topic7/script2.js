// make the background looks like near the sun
// RadialGradient is not p5.js function, this is WebAPI function
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient

let drawWarmBackground = function () {
  let gradient = drawingContext.createRadialGradient(
    width / 2,
    height / 2,
    60,
    width / 2,
    height / 2,
    height / 2
  );

  gradient.addColorStop(0, color(238, 93, 95));
  gradient.addColorStop(0.05, color(231, 126, 110));
  gradient.addColorStop(0.1, color(231, 62, 101));
  gradient.addColorStop(0.15, color(146, 0, 4));
  gradient.addColorStop(1, color(90, 6, 0));
  drawingContext.fillStyle = gradient;

  rect(0, 50, width, height - 50 - 120);
};
