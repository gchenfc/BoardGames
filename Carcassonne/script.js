/**
 * This is the main file which launches the game.
 */

import Carcassonne from "./game.js";

const myGame = new Carcassonne();

document.addEventListener("DOMContentLoaded", function () {
  myGame.updateDraw();
});

// Expose the game globally for debugging
window.myGame = myGame;
