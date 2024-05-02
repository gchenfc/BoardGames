const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// App setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Game state
let gameState = {
  // Add your game state properties here
};

// Handle a connection request from clients
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send the current game state to the new client
  socket.emit('gameState', gameState);

  // Handle a move or action by a client
  socket.on('move', (move) => {
    // Update the game state based on the move
    // For example: gameState.tiles.push(move)
    
    // Broadcast the updated game state to all clients
    io.emit('gameState', gameState);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Server setup
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
