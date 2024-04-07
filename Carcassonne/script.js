import Game from "../util/game.js";
import { BoardElement, FloatingElement, SelectBehaviors } from "../util/element.js";
import Point2 from "../util/point2.js";
import { SPRITES, CARDS } from "./cards.js";
import shuffleArray from "../util/shuffle.js";

const GRID_DIM = 100,
  GRID_PADDING = 10;
const GRID_W = 40,
  GRID_H = 40;

class GameState {
  constructor(grid, drawPile, meeples, scores) {
    this.grid = grid;
    this.drawPile = drawPile;
    this.meeples = meeples;
    this.scores = scores;
  }
}

class ServerDummy {
  constructor() {
    this.gameState = new GameState({}, shuffleArray(CARDS), {}, {});
  }

  doMove(target) {
    this.gameState.grid[target] = this.gameState.drawPile.pop();
    myGame.updateGameState(this.gameState);
  }
}
const server = new ServerDummy();
window.myServer = server;

class Carcassonne extends Game {
  constructor() {
    let visualElements = {};

    // Add a grid of cards
    for (let i = -GRID_W / 2; i < GRID_W / 2; i++) {
      for (let j = -GRID_H / 2; j < GRID_H / 2; j++) {
        visualElements[`card ${i} ${j}`] = new Card(i, j);
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
        isSelectable: true,
        // selectBehavior: SelectBehaviors.FOLLOW_MOUSE,
      }
    );

    super(visualElements);

    // As a precaution, update the draw every 200ms.  Also helps with sprite loading
    setInterval(() => {
      this.updateDraw();
    }, 200);
  }

  updateGameState(gameState) {
    for (let [key, elem] of Object.entries(this.visualElements)) {
      if (key.startsWith("card")) {
        if (key in gameState.grid) {
          elem.setCard(gameState.grid[key]);
        } else {
          elem.setCard(null);
        }
      }
    }

    console.log("Updating gamestate!", this.visualElements["topDrawCard"]);
    this.visualElements["topDrawCard"].point = new Point2(10, 10);
    this.updateDraw();
  }

  validMoves(elemKey) {
    if (elemKey === "topDrawCard") {
      return Object.keys(this.visualElements).filter((key) => key.startsWith("card"));
    }
  }

  tryMoveElemToElem(fromKey, toKey) {
    console.log(`Moving ${fromKey} to ${toKey}`);
    if (fromKey === "topDrawCard" && toKey.startsWith("card")) {
      this.sendMove(toKey);
      return true;
    }
    return false;
  }

  // Dummy!
  sendMove(move) {
    server.doMove(move);
  }
}

class Card extends BoardElement {
  constructor(i, j) {
    super(i * GRID_DIM, j * GRID_DIM, GRID_DIM - GRID_PADDING, GRID_DIM - GRID_PADDING, 1);
    this.i = i;
    this.j = j;
    this.card = null;
  }

  drawSprite(ctx) {
    if (this.card) {
      ctx.drawImage(this.sprite, this.point.x, this.point.y, this.width, this.height);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(this.point.x, this.point.y, this.width, this.height);
    }
  }

  setCard(card) {
    this.card = card;
    this.sprite = card ? SPRITES[card] : 1;
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
