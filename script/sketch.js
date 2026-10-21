/*
 * CM1010 final project
 * Student: NGAI, Chi Hung (220227964)
 * p5.js 1.8.0, p5.sound 1.0.1
 */

//global for the controls and input
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
// sound files
var soundSource = [];
var sounds = [];
var playingSound = 0;
// speed of play
var playSpeed;
// volumen of play
var playVolume;
//variable for p5 fast fourier transform
var fourier;
// GoldSmiths, UoL logo
var logo, logo2;
// font files array
var fontFiles = [];
// variables for the music player
var canvas = null;
var divPanel;
var music_player = null;
// for the 3D canvas in the first visual
var threeDCanvas;
// record the time before calling the fifth visual
var fifthVisualTime;

function preload() {
  // preload the sound information
  soundSource = [
    "./assets/gfriend_summer_rain.mp3",
    "./assets/viviz_maniac.mp3",
    "./assets/gfriend_flower_garden.mp3",
    "./assets/gfriend_a_starry_sky.opus",
    "./assets/viviz_day_by_day.mp3",
    "./assets/gfriend_sunrise.mp3",
    "./assets/gfriend_rainbow.mp3",
    "./assets/gfriend_mago.mp3",
  ];

  soundSource.forEach((source) => {
    sounds.push(
      loadSound(
        source,
        () => successLoadFile(source),
        () => errorLoadFile(source),
        () => whileLoadingFile(source)
      )
    );
  });

  sound = sounds[playingSound];

  playVolume = 0.1;
  sound.setVolume(playVolume);

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
      () => successLoadFile(source.path.split(/(\\|\/)/g).pop()),
      () => errorLoadFile(source.path.split(/(\\|\/)/g).pop())
    )
  );
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

  // draw the music player body
  music_player = new Music_Player_Frame();

  // set up the control panel
  controls = new ControlsAndInput();

  // create a new visualisation container and add visualisations
  vis = new Visualisations();
  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new Phyllotaxis());
  vis.add(new Disco());

  // instantiate the fft object
  fourier = new p5.FFT();

  // set the sound setting
  playSpeed = 1;

  // prepare stars for the first and fifth visual
  vis.visuals[0].setup();
  vis.visuals[4].setup();

  // make all angles as degree
  angleMode(DEGREES);
}

function draw() {
  // draw the music player
  music_player.draw();

  // only in the first visualisation, 3D canvas will be drawn
  vis.selectedVisual.draw();
  if (vis.selectedVisual.name == "spectrum") image(threeDCanvas, 0, 0);

  // draw the controls items
  controls.draw();
}

function mouseClicked() {
  // based on the click position checking result, make the window fullscreen or revert to windowed
  if (!controls.mousePressed()) {
    let fullScreen = fullscreen();
    fullscreen(!fullScreen);
  }
}

// send signal to contols signal
function keyPressed() {
  controls.keyPressed(keyCode);
}

// when the window has been resized. Resize canvas to fit
function windowResized() {
  resizeCanvas(divPanel.size().width, divPanel.size().height);
  background(color(39, 40, 41));
}
