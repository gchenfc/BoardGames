// Include the socket.io client library in your HTML file:
// <script src="https://cdn.socket.io/4.7.5/socket.io.min.js" integrity="sha384-2huaZvOR9iDzHqslqwpR87isEmrfxqyWOF7hr7BY6KG0+hVKLoEXMPUJw3ynWuhO" crossorigin="anonymous"></script>

/**
 * Browser socket client for games.
 * Usage: When inheriting from Game (game.js), override GameState with your GameState class (game-logic.js).
 */
export class Client {
  constructor(game) {
    this.socket = io("http://localhost:4001");

    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.start();
    });

    // Function to handle the received game state
    this.socket.on("gameState", (gameState) => {
      const gameState_ = game.GameState.Clone(gameState);
      game.updateGameState(gameState_);
    });
  }

  async start(room = "testingRoom") {
    // temporary.  TODO: implement a generic lobby system
    await this.socket.emit("join", room);
    this.socket.emit("start");
  }

  sendMove(move) {
    this.socket.emit("move", move);
  }
}
