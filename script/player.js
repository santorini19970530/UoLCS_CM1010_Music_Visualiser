// owns the track list, the current track, volume, speed, and the FFT

class Player {
  // private
  #paths = [];
  #sounds = [];
  #index = 0;
  #speed = 1;
  #volume = 0.1;
  #fourier = null;
  #mark = 0;

  addTrack(path) {
    this.#paths.push(path);
    const loaded = loadSound(
      path,
      () => successLoadFile(path),
      () => errorLoadFile(path),
      () => whileLoadingFile(path)
    );
    loaded.setVolume(this.#volume);
    this.#sounds.push(loaded);
  }

  start() {
    this.#fourier = new p5.FFT();
    this.#speed = 1;
    this.current().setVolume(this.#volume);
  }

  get index() {
    return this.#index;
  }

  get count() {
    return this.#sounds.length;
  }

  get volume() {
    return this.#volume;
  }

  set volume(value) {
    this.#volume = value;
    this.current().setVolume(this.#volume);
  }

  get speed() {
    return this.#speed;
  }

  set speed(value) {
    this.#speed = value;
    if (this.isPlaying()) this.current().rate(this.#speed);
  }

  pathAt(index) {
    return this.#paths[index];
  }

  current() {
    return this.#sounds[this.#index];
  }

  isPlaying() {
    return this.current().isPlaying();
  }

  currentTime() {
    return this.current().currentTime();
  }

  duration() {
    return this.current().duration();
  }

  analyse() {
    return this.#fourier.analyze();
  }

  waveform() {
    return this.#fourier.waveform();
  }

  energy(first, second) {
    if (second === undefined) return this.#fourier.getEnergy(first);
    return this.#fourier.getEnergy(first, second);
  }

  pause() {
    this.current().pause();
  }

  stop() {
    this.current().stop();
  }

  select(index) {
    this.#index = index;
  }

  loopCurrent() {
    this.current().loop();
  }

  startLoop() {
    const track = this.current();
    track.setVolume(this.#volume);
    track.loop();
    track.rate(this.#speed);
  }

  startOnce() {
    const track = this.current();
    track.setVolume(this.#volume);
    track.play();
    track.rate(this.#speed);
  }

  // sets the sound output only, leaving the stored volume unchanged
  outputVolume(level) {
    this.current().setVolume(level);
  }

  markNow() {
    this.#mark = millis();
  }

  elapsed() {
    return millis() - this.#mark;
  }
}
