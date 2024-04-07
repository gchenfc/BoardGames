import Game from "../util/game.js";
import { BoardElement, FloatingElement, SelectBehaviors } from "../util/element.js";
import Point2 from "../util/point2.js";
import { SPRITES, CARDS } from "./cards.js";
import createSprite from "../util/sprites.js";
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

  doMove(move) {
    const { location, angle } = move;
    this.gameState.grid[location] = { card: this.gameState.drawPile.pop(), angle: angle };
    myGame.updateGameState(this.gameState);
  }

  sendUpdate() {
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

    // Button for rotating
    visualElements["rotateButton"] = new FloatingElement(
      110,
      10,
      100,
      100,
      createSprite("sprites/rotate.svg"),
      { isClickable: true }
    );

    super(visualElements);

    // Add a keyboard listener for the "r" key to rotate the top draw card
    window.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        this.visualElements["topDrawCard"].angle += Math.PI / 2;
      }
      this.updateDraw();
    });

    // As a precaution, update the draw every 200ms.  Also helps with sprite loading
    setInterval(() => {
      this.updateDraw();
    }, 200);
  }

  updateGameState(gameState) {
    for (let [key, elem] of Object.entries(this.visualElements)) {
      if (key.startsWith("card")) {
        if (key in gameState.grid) {
          elem.setCard(gameState.grid[key].card, gameState.grid[key].angle);
        } else {
          elem.setCard(null, 0);
        }
      }
    }

    console.log("Updating gamestate!", this.visualElements["topDrawCard"]);
    this.visualElements["topDrawCard"].point = new Point2(10, 10);
    this.visualElements["topDrawCard"].angle = 0;
    this.visualElements["topDrawCard"].sprite =
      SPRITES[gameState.drawPile[gameState.drawPile.length - 1]];
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
      this.sendMove({ location: toKey, angle: this.visualElements["topDrawCard"].angle });
      return true;
    }
    return false;
  }

  buttonClicked(buttonKey) {
    console.assert(buttonKey === "rotateButton");
    this.visualElements["topDrawCard"].angle += Math.PI / 2;
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
      super.drawSprite(ctx);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(this.point.x, this.point.y, this.width, this.height);
    }
  }

  setCard(card, angle) {
    this.card = card;
    this.angle = angle;
    this.sprite = card ? SPRITES[card] : 1;
  }

  toString() {
    return `card ${this.i} ${this.j} [${this.card}]`;
  }
}

const myGame = new Carcassonne();

document.addEventListener("DOMContentLoaded", function () {
  myGame.updateDraw();
  server.sendUpdate();
});

// Expose the game globally for debugging
window.myGame = myGame;
