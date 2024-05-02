// const io = require('socket.io-client');
// <script src="https://cdn.socket.io/4.7.5/socket.io.min.js" integrity="sha384-2huaZvOR9iDzHqslqwpR87isEmrfxqyWOF7hr7BY6KG0+hVKLoEXMPUJw3ynWuhO" crossorigin="anonymous"></script>

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
      console.log("Game state updated:", gameState_.drawPile.length, "cards left");
      for (const [location, cardState] of Object.entries(gameState_.placed)) {
        console.log('\tgot', location, cardState);
      }
      game.updateGameState(gameState_);
    });
  }

  async start(room = "testingRoom") {
    // temporary
    await this.socket.emit("join", room);
    this.socket.emit("start");
  }

  sendMove(move) {
    console.log("Sending move:", move);
    this.socket.emit("move", move);
  }
}
