/*
 * Midterm Project of CM1010, September 2023 Term
 * Student Name: NGAI, Chi Hung
 * Student Number: 220227964
 *
 * My development environment
 *
 *  - Macbook Air 13 inch M1 chip
 *
 *  - MavOS Terminal, for file manipulation and calling php server
 *
 *  - iTerm2: for calling neovim editor
 *
 *  - neovim v0.94
 *
 *  - php v8.2.12
 *
 *  - p5.js v1.8.0 October 25, 2023
 *
 *  - p5.sound v1.0.1 - 2021-05-25
 *
 *  - browser : Google Chrome
 *
 *  - screen recorder : QuickTime Player
 *
 *  - working file stored on git : https://github.com/santorini19970530/UoLCS_CM1010_Music_Visualiser
 *
 *  - my monitor Acer VG280K, resolution : 6016 * 3384
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
// variables for the music player
var canvas = null;
var divPanel;
var music_player = null;
// control the amount of stars
const starsAmountMax = 40;
var stars = [];
// control the amount of the mountains
const mountainAmountMax = 10;
var mountains = [];

function preload() {
  // preload the sound information
  soundSource = [
    "./assets/gfriend_summer_rain.mp3",
    "./assets/viviz_maniac.mp3",
    "./assets/stomper_reggae_bit.mp3",
    "./assets/gfriend_a_starry_sky.opus",
    "./assets/viviz_day_by_day.mp3",
  ];

  soundSource.forEach((source, i) => {
    sounds[i] = loadSound(source);
  });

  sound = sounds[playingSound];

  playVolume = 0.1;
  sound.setVolume(playVolume);

  // preload the school logos
  logo = loadImage("../images/logo2.svg");
  logo2 = loadImage("../images/logo.svg");

  // preload the font styles
  fontMedium = loadFont("../fonts/Gabarito/static/Gabarito-Medium.ttf");
  fontDigit = loadFont(
    "../fonts/Major_Mono_Display/MajorMonoDisplay-Regular.ttf"
  );
}

function setup() {
  // make the canvas fill up the window, except the div projectTitlePanel
  divPanel = select("#canvasPanel");
  canvas = createCanvas(divPanel.size().width, divPanel.size().height);
  canvas.parent("canvasPanel");
  background(color(39, 40, 41));

  // draw the music player
  music_player = new Music_Player_Frame();

  // set up the control panel
  controls = new ControlsAndInput();

  // create a new visualisation container and add visualisations
  vis = new Visualisations();
  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new Phyllotaxis());

  // instantiate the fft object
  fourier = new p5.FFT();

  // set the sound setting
  playSpeed = 1;

  // draw the first visual
  for (let i = 0; i < starsAmountMax; i++)
    stars.push(
      new Star(random(0, width), random(50, height - 150), random(5, 10))
    );

  for (let i = 0; i < mountainAmountMax; i++) {
    mountains.push(new Mountain(i * 500, height - 120, 500));
  }

  // make all angles as degree
  angleMode(DEGREES);
}

function draw() {
  // draw the music player
  music_player.draw();

  //draw the selected visualisation
  vis.selectedVisual.draw();

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

function keyPressed() {
  // send signal to contols signal
  controls.keyPressed(keyCode);
}

function windowResized() {
  // when the window has been resized. Resize canvas to fit
  resizeCanvas(divPanel.size().width, divPanel.size().height);
  background(color(39, 40, 41));
}
