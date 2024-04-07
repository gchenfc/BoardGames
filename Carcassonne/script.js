import Game from "../util/game.js";
import { BoardElement, FloatingElement } from "../util/element.js";
import Point2 from "../util/point2.js";

const GRID_DIM = 100,
  GRID_PADDING = 10;
const GRID_W = 4,
  GRID_H = 4;

class Carcassonne extends Game {
  constructor() {
    let visualElements = {};

    // Add a grid of cards
    for (let i = -GRID_W / 2; i < GRID_W / 2; i++) {
      for (let j = -GRID_H / 2; j < GRID_H / 2; j++) {
        visualElements[["card", i, j]] = new Card(i, j);
      }
    }

    // Add a floating card draw pile
    visualElements["drawPile"] = new FloatingElement(
      10,
      10,
      GRID_DIM - GRID_PADDING,
      GRID_DIM - GRID_PADDING,
      null,
      {
        isDraggable: false,
      }
    );
    visualElements["topDrawCard"] = new FloatingElement(
      10,
      10,
      GRID_DIM - GRID_PADDING,
      GRID_DIM - GRID_PADDING,
      null,
      {
        isDraggable: true,
      }
    );

    super(visualElements);
  }

  updateGameState(gameState) {
    this._WARNING("updateGameState");
  }
}

class Card extends BoardElement {
  constructor(i, j) {
    super(i * GRID_DIM, j * GRID_DIM, GRID_DIM - GRID_PADDING, GRID_DIM - GRID_PADDING);
    this.i = i;
    this.j = j;
    this.card = null;
  }

  toString() {
    return `card ${this.i} ${this.j} [${this.card}]`;
  }
}

const myGame = new Carcassonne();

document.addEventListener("DOMContentLoaded", function () {
  myGame.updateDraw();
});

// Expose the game globally for debugging
window.myGame = myGame;
