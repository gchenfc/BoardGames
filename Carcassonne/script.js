import Game from "../util/game.js";
import { BoardElement, FloatingElement } from "../util/element.js";

const GRID_DIM = 100;
const GRID_W = 3,
  GRID_H = 3;

class Carcassonne extends Game {
  constructor() {
    let visualElements = {}

    // Add a grid of cards
    for (let i = -GRID_W / 2; i < GRID_W / 2; i++) {
      for (let j = -GRID_H / 2; j < GRID_H / 2; j++) {
        visualElements[["card", i, j]] = new Card(i, j);
      }
    }

    // Add a floating card draw pile
    visualElements["drawPile"] = new FloatingElement(10, 10, 100, 100);

    super(visualElements, true);
  }

  updateGameState(gameState) {
    this._WARNING("updateGameState");
  }
}

class Card extends BoardElement {
  constructor(i, j) {
    super(i * GRID_DIM, j * GRID_DIM, GRID_DIM - 10, GRID_DIM - 10);
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
