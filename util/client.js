const io = require('socket.io-client');
const socket = io('http://localhost:4001');

// Function to handle the received game state
socket.on('gameState', (gameState) => {
  console.log('Game state updated:', gameState);
});

// Function to send a move to the server
function makeMove(move) {
  socket.emit('move', move);
}
