/**
 * Here we implement the game logic for Carcassonne.
 * TODO: implement scoring & meeple placement.
 */

import { Card, DECK } from "./cards.js";
import Point2 from "../util/point2.js";
import shuffleArray from "../util/shuffle.js";
import GameStateInterface from "../util/game-logic.js";

export class CardState {
  constructor(card, angle, hidden) {
    this.card = card;
    this.angle = angle;
    this.hidden = hidden;
  }

  static Clone(obj) {
    return new CardState(obj.card, obj.angle, obj.hidden);
  }

  edge(index) {
    const cardIndex = (index - this.angle + 4) % 4;
    return this.card.edges[cardIndex];
  }

  field(index) {
    const cardIndex = (index - this.angle * 2 + 8) % 8;
    return this.card.connected_fields[cardIndex];
  }
}

/***************************************************************************************************
 * Carcasonne GameState
 **************************************************************************************************/
export class GameState extends GameStateInterface {
  /**
   *
   * @param {Point2: CardState} placed Dictionary of card locations
   * @param {Array[Card]} drawPile List of cards in the draw pile
   * @param {Point2: Int} meeples Dictionary of meeples on the board
   * @param {Array[Int]} scores List of player scores
   * @param {Int} currentPlayer Index of the current player
   */
  constructor(placed, drawPile, meeples, scores, currentPlayer) {
    super();
    this.placed = placed;
    this.drawPile = drawPile;
    this.meeples = meeples;
    this.scores = scores;
    this.currentPlayer = currentPlayer;
  }

  static New(numPlayers) {
    return new GameState({}, shuffleArray(DECK), {}, Array(numPlayers).fill(0));
  }

  static Clone(obj) {
    const cloneDictOfCardState = (dict) =>
      Object.fromEntries(Object.entries(dict).map(([k, v]) => [k, CardState.Clone(v)]));
    return new GameState(
      cloneDictOfCardState(obj.placed),
      obj.drawPile,
      obj.meeples,
      obj.scores,
      obj.currentPlayer
    );
  }

  doMove(move) {
    const { location, angle } = move;
    const cardState = new CardState(this.peek(), angle, false);
    const location_ = Point2.Clone(location);
    if (this.isValidPlacement(location_, cardState)) {
      this.placed[location_] = cardState;
      this.drawPile.pop();
      return true;
    }
    return false;
  }

  /*********************************** end mandatory interface ************************************/

  peek() {
    return this.drawPile[this.drawPile.length - 1];
  }

  pop() {
    return this.drawPile.pop();
  }

  isValidCardAtLocation(point2) {
    if (!(point2 in this.placed)) return false;
    const thisCardState = this.placed[point2];

    function checkEdgeLoc(gameState, loc, myEdge, targetEdge) {
      if (!(loc in gameState.placed)) return true;
      console.log(
        `checking location ${loc.x} ${loc.y} edge ${targetEdge} ${myEdge}.  ${gameState.placed[
          loc
        ].edge(targetEdge)}, ${thisCardState.edge(myEdge)}.  Angles are ${
          gameState.placed[loc].angle
        }, ${thisCardState.angle}.`
      );
      const ret = gameState.placed[loc].edge(targetEdge) == thisCardState.edge(myEdge);
      return ret;
    }
    function atLeastOneAdjacent(gameState, loc) {
      if (Object.keys(gameState.placed).length <= 1) return true;
      return (
        loc.plus(new Point2(1, 0)) in gameState.placed ||
        loc.plus(new Point2(-1, 0)) in gameState.placed ||
        loc.plus(new Point2(0, 1)) in gameState.placed ||
        loc.plus(new Point2(0, -1)) in gameState.placed
      );
    }
    return (
      checkEdgeLoc(this, point2.plus(new Point2(+1, 0)), 0, 2) &&
      checkEdgeLoc(this, point2.plus(new Point2(-1, 0)), 2, 0) &&
      checkEdgeLoc(this, point2.plus(new Point2(0, +1)), 1, 3) &&
      checkEdgeLoc(this, point2.plus(new Point2(0, -1)), 3, 1) &&
      atLeastOneAdjacent(this, point2)
    );
  }

  isValidPlacement(point2, cardState) {
    if (point2 in this.placed) return false;
    this.placed[point2] = cardState;
    const isValid = this.isValidCardAtLocation(point2);
    delete this.placed[point2];
    return isValid;
  }

  isValidBoardState() {
    return this.placed.every((point2, cardState) => this.isValidCardAtLocation(point2));
  }
}
