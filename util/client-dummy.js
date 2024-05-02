/**
 * Local client for testing purposes
 */
export class DummyClient {
  constructor(game) {
    this.game = game;
    setTimeout(this.startGame.bind(this), 1); // wait for Game constructor to exit
  }

  startGame() {
    this.gameState = this.game.GameState.New(1);
    this.game.updateGameState(this.gameState);
  }

  sendMove(move) {
    this.gameState.doMove(move);
    this.game.updateGameState(this.gameState);
  }
}
