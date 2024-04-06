import CanvasNavigation from "./canvas-navigation.js";
import { VisualElement } from "./element.js";

/// Game class is a common interface for games
//  Update the game by updating this.visualElements and calling this.updateDraw()
export default class Game {
  constructor(visualElements = {}, debug = false) {
    this.visualElements = visualElements;
    this.canvas = new Canvas(visualElements, debug);
  }

  /***********************************  Functions to Implement  ***********************************/
  /// We received a new game state from the server
  updateGameState(gameState) {
    this._WARNING("updateGameState");
  }

  /// The user pressed a button
  onElementPress(element) {
    this._WARNING("onElementPress");
  }

  /// The user dra

  /**************************  Functions available to use (do not edit)  **************************/
  /// Redraw the canvas
  updateDraw() {
    this.canvas.draw();
  }

  /// Send a move to the server
  sendMove(move) {
    // TODO: implement
  }

  /*******************************  Helper Functions (don't touch)  *******************************/
  // Warning message for unimplemented methods
  _WARNING(fName = "unknown method") {
    console.warn(
      'WARNING! Function "' + fName + '" is not implemented in ' + this.constructor.name
    );
  }
}

/// Canvas class is a common interface for drawing on a canvas boilerplate
class Canvas {
  constructor(visualElements, debug = false) {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvasNav = new CanvasNavigation(this.canvas, this.draw.bind(this));
    this.visualElements = visualElements;
    this.debug = debug;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.canvasNav.zoomLevel, this.canvasNav.zoomLevel);
    this.ctx.translate(this.canvasNav.panX, this.canvasNav.panY);

    for (const [key, element] of Object.entries(this.visualElements)) {
      if (!element.properties.isFloating) element.draw(this.ctx, key, this.debug);
    }

    this.ctx.restore();

    for (const [key, element] of Object.entries(this.visualElements)) {
      if (element.properties.isFloating) element.draw(this.ctx, key, this.debug);
    }
  }
}
