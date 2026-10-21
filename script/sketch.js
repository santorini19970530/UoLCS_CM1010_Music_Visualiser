/*
 * CM1010 final project
 * Student: NGAI, Chi Hung (220227964)
 * p5.js 1.8.0, p5.sound 1.0.1
 */

// global for the controls and input
let controls = null;
// store visualisations in a container
let vis = null;
// playback: tracks, volume, speed, and the FFT
let player = null;
// Goldsmiths, UoL logo
let logo;
let logo2;
// font files array
let fontFiles = [];
// variables for the music player
let canvas = null;
let divPanel;
let musicPlayer = null;
function preload() {
  player = new Player();
  [
    "./assets/gfriend_summer_rain.mp3",
    "./assets/viviz_maniac.mp3",
    "./assets/gfriend_flower_garden.mp3",
    "./assets/gfriend_a_starry_sky.opus",
    "./assets/viviz_day_by_day.mp3",
    "./assets/gfriend_sunrise.mp3",
    "./assets/gfriend_rainbow.mp3",
    "./assets/gfriend_mago.mp3",
  ].forEach((source) => player.addTrack(source));

  // preload the school logos and spotlight image
  logo = loadImage(
    "../images/logo2.svg",
    () => successLoadFile("logo2.svg"),
    () => errorLoadFile("logo2.svg")
  );
  logo2 = loadImage(
    "../images/logo.svg",
    () => successLoadFile("logo.svg"),
    () => errorLoadFile("logo.svg")
  );

  // preload the font styles
  fontFiles = [
    {
      name: "fontMedium",
      path: "../fonts/Gabarito/static/Gabarito-Medium.ttf",
    },
    {
      name: "fontDigit",
      path: "../fonts/Major_Mono_Display/MajorMonoDisplay-Regular.ttf",
    },
    {
      name: "fontLyrics",
      path: "../fonts/Black_Han_Sans/BlackHanSans-Regular.ttf",
    },
  ];

  fontFiles.forEach((source) =>
    loadFont(
      source.path,
      (font) => {
        source.font = font;
        successLoadFile(source.path.split(/(\\|\/)/g).pop());
      },
      () => errorLoadFile(source.path.split(/(\\|\/)/g).pop())
    )
  );
}

function fontNamed(name) {
  const entry = fontFiles.find((file) => file.name === name);
  return entry ? entry.font : undefined;
}

// callbacks for ensuring the sounds are correctly loaded
function successLoadFile(source) {
  console.log("Success loading file " + source);
}

function errorLoadFile(source) {
  console.error("Failed loading file " + source);
}

function whileLoadingFile(source) {
  console.log("Loading file " + source);
}

function setup() {
  // make the canvas fill up the window, except the div projectTitlePanel
  divPanel = select("#canvasPanel");
  canvas = createCanvas(divPanel.size().width, divPanel.size().height);
  canvas.parent("canvasPanel");
  background(color(39, 40, 41));

  // draw the music player body
  musicPlayer = new MusicPlayerFrame();

  // set up the control panel
  controls = new ControlsAndInput();

  // create a new visualisation container and add visualisations
  vis = new Visualisations();
  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new Phyllotaxis());
  vis.add(new Disco());

  player.start();

  // terrain mesh for the first visual; stars and bubbles are created while audio plays
  vis.visuals[0].setup();

  // make all angles as degree
  angleMode(DEGREES);
}

function draw() {
  // draw the music player
  musicPlayer.draw();

  vis.selectedVisual.draw();

  // draw the controls items
  controls.draw();
}

function mouseDragged() {
  controls.dragged();
}

function mouseClicked() {
  controls.mousePressed();
}

// send signal to contols signal
function keyPressed() {
  // g toggles fullscreen; other keys go to the player controls
  if (keyCode === 71) {
    fullscreen(!fullscreen());
    return;
  }
  controls.keyPressed(keyCode);
}

// when the window has been resized. Resize canvas to fit
function windowResized() {
  resizeCanvas(divPanel.size().width, divPanel.size().height);
  background(color(39, 40, 41));
  controls.layout();
  vis.visuals[0].resizeGraphics();
}
