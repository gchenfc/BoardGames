/**
 * This is the main file which launches the game.
 */

import Carcassonne from "./game.js";
import { GameState } from "./game-logic.js";

const myGame = new Carcassonne(GameState.New(2));

document.addEventListener("DOMContentLoaded", function () {
  myGame.updateDraw();
});

// Expose the game globally for debugging
window.myGame = myGame;
