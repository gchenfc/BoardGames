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

  /// The user click-ed an element
  onElementClick(elementKey) {
    console.log(`Clicked on ${elementKey}`);
  }

  /// The user dragged an element
  onElementDragStart(elementKey) {
    if (elementKey === "topDrawCard") {
      // Move to board coordinates (not floating)
      const topCard = this.visualElements["topDrawCard"];
      // topCard.properties.isFloating = false;
    }
  }

  onElementDragStartUndo(elementKey) {
    if (elementKey === "topDrawCard") {
      // Move back to floating coordinates
      const topCard = this.visualElements["topDrawCard"];
      // topCard.properties.isFloating = true;
    }
  }

  /// The user dragged an element
  onElementDragEnd(elementKey) {
    if (elementKey === "topDrawCard") {
      // Add the previous top draw card to the board and replace it with a new card
      this.visualElements["123"] = this.visualElements["topDrawCard"];
      this.setFloating(this.visualElements["123"], false);
      this.visualElements["123"].properties.isDraggable = false;
      // New top draw card
      this.visualElements["topDrawCard"] = new FloatingElement(
        10,
        10,
        GRID_DIM - GRID_PADDING,
        GRID_DIM - GRID_PADDING,
        null,
        {
          isDraggable: true,
        }
      );
      this.updateDraw();
      console.log(this.visualElements);
    }
    console.log(`Dropped ${elementKey}`);
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
