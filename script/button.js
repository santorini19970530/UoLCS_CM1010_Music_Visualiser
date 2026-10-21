/* Button class to contain the basic information of each buttons */

class Button {
  // private
  #x;
  #y;
  #width;
  #height;

  constructor(x, y, buttonWidth, buttonHeight, drawStrategy, hitCheckStrategy) {
    // set the button size and position
    this.#x = x;
    this.#y = y;
    this.#width = buttonWidth;
    this.#height = buttonHeight;

    // set up the draw strategy
    this.drawStrategy = drawStrategy;

    // set up the hit check strategy
    this.hitCheckStrategy = hitCheckStrategy;

    this.#setPosition(x, y, buttonWidth, buttonHeight);
  }

  // private
  #setPosition(x, y, buttonWidth, buttonHeight) {
    this.#x = x;
    this.#y = y;
    this.#width = buttonWidth;
    this.#height = buttonHeight;

    this.drawStrategy.x = this.#x;
    this.drawStrategy.y = this.#y;
    this.drawStrategy.width = this.#width;
    this.drawStrategy.height = this.#height;

    this.hitCheckStrategy.x = this.#x;
    this.hitCheckStrategy.y = this.#y;
    this.hitCheckStrategy.width = this.#width;
    this.hitCheckStrategy.height = this.#height;
  }

  // public
  // draw the button, by caling the draw strategy
  draw() {
    this.drawStrategy.draw();
  }

  // draw the button, by calling the hit check strategy
  hitCheck() {
    this.hitCheckStrategy.y = height - 80;
    return this.hitCheckStrategy.hitCheck();
  }
}
