import Game from "../util/game.js";
import { VisualElement, BoardElement, FloatingElement, SelectBehaviors } from "../util/element.js";
import Point2 from "../util/point2.js";
import createSprite from "../util/sprites.js";
import shuffleArray from "../util/shuffle.js";
import { CardState, GameState } from "./game-logic.js";
import { SPRITES } from "./sprites.js";

const GRID_DIM = 100,
  GRID_PADDING = 10;
const GRID_W = 40,
  GRID_H = 40;

const HIGHLIGHT_VALID_MOVES = true;

/**********************************/

class GridSpace extends BoardElement {
  constructor(i, j) {
    super(i * GRID_DIM, -j * GRID_DIM, GRID_DIM - GRID_PADDING, GRID_DIM - GRID_PADDING, 1);
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
    this.sprite = card ? SPRITES[card.key] : 1;
  }

  toString() {
    return `grid ${this.i} ${this.j} [${this.card}]`;
  }
}

/**********************************/

class Carcassonne extends Game {
  GameState = GameState;

  constructor(gameState) {
    let visualElements = {};

    // Create grid
    for (let i = -GRID_W / 2; i < GRID_W / 2; i++) {
      for (let j = -GRID_H / 2; j < GRID_H / 2; j++) {
        visualElements[`grid ${i} ${j}`] = new GridSpace(i, j);
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

    this.updateGameState(gameState);

    // Add a keyboard listener for the "r" key to rotate the top draw card
    window.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        this.visualElements["topDrawCard"].angle += Math.PI / 2;
        this.visualElements["topDrawCard"].angle %= 2 * Math.PI;
      }
      if (HIGHLIGHT_VALID_MOVES) this.highlightValidMoves();
      this.updateDraw();
    });

    // As a precaution, update the draw every 200ms.  Also helps with sprite loading
    setInterval(() => {
      this.updateDraw();
    }, 200);
  }

  updateGameState(gameState) {
    this.gameState = gameState;
    if (HIGHLIGHT_VALID_MOVES) this.highlightValidMoves();
    // Set each card in the grid show the card in the gameState
    for (let [key, elem] of Object.entries(this.visualElements)) {
      if (key.startsWith("grid")) {
        const xy = Point2.FromString(key);
        if (xy in gameState.placed) {
          elem.setCard(gameState.placed[xy].card, (gameState.placed[xy].angle * Math.PI) / 2);
        } else {
          elem.setCard(null, 0);
        }
      }
    }

    this.visualElements["topDrawCard"].point = new Point2(10, 10);
    this.visualElements["topDrawCard"].angle = 0;
    window.gameState = gameState;
    this.visualElements["topDrawCard"].sprite = SPRITES[gameState.peek().key];
    this.updateDraw();
  }

  validMoves(elemKey) {
    if (elemKey === "topDrawCard") {
      const cardState = new CardState(
        gameState.peek(),
        this.visualElements["topDrawCard"].angle / (Math.PI / 2),
        false
      );
      if (HIGHLIGHT_VALID_MOVES) this.highlightValidMoves();
      return Object.keys(this.visualElements).filter(
        (key) =>
          key.startsWith("grid") &&
          this.gameState.isValidPlacement(Point2.FromString(key), cardState)
      );
    }
    return [];
  }

  tryMoveElemToElem(fromKey, toKey) {
    console.log(`Moving ${fromKey} to ${toKey}`);
    if (fromKey === "topDrawCard" && toKey.startsWith("grid")) {
      const move = {
        location: Point2.FromString(toKey),
        angle: this.visualElements["topDrawCard"].angle / (Math.PI / 2),
      };
      console.log("Sending move:", move);
      if (this.gameState.doMove(move)) {
        this.sendMove(move);
        return true;
      }
    }
    return false;
  }

  highlightValidMoves() {
    const cardState = new CardState(
      this.gameState.peek(),
      this.visualElements["topDrawCard"].angle / (Math.PI / 2),
      false
    );
    for (const [key, elem] of Object.entries(this.visualElements)) {
      if (key.startsWith("grid")) {
        elem.state.isHighlighted = this.gameState.isValidPlacement(
          Point2.FromString(key),
          cardState
        );
      }
    }
  }

  buttonClicked(buttonKey) {
    console.assert(buttonKey === "rotateButton");
    this.visualElements["topDrawCard"].angle += Math.PI / 2;
    this.visualElements["topDrawCard"].angle %= 2 * Math.PI;
  }
}

const myGame = new Carcassonne(GameState.New(2));

document.addEventListener("DOMContentLoaded", function () {
  myGame.updateDraw();
});

// Expose the game globally for debugging
window.myGame = myGame;
