// const express = require("express");
// const http = require("http");
// const socketIO = require("socket.io");
import express from "express";
import cors from "cors";
import http from "http";
import { Server as socketIO } from "socket.io";

// App setup
export class Server {
  constructor(GameLogic) {
    this.app = express();
    this.app.use(cors());
    this.server = http.createServer(this.app);
    this.io = new socketIO(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.GameLogic = GameLogic;
    this.games = {};
  }

  start(port) {
    this.io.on("connection", (socket) => {
      console.log("New client connected");
      socket.join("lobby");

      // Join a waiting room
      socket.on("join", (room) => {
        console.log(`Joining room ${room}`);
        if (this.games[room]) {
          throw new Error("Game already exists");
        } else {
          // Leave all other rooms
          socket.rooms.forEach((room) => {
            if (room !== socket.id) {
              socket.leave(room); // Do not leave its own socket ID room
            }
          });
          socket.join(room);
        }
      });

      // Start the game!
      socket.on("start", () => {
        if (socket.rooms.has("lobby")) {
          throw new Error("Cannot start game from lobby");
        }
        this.startGame(Array.from(socket.rooms)[1]);
      });

      // Handle a move
      socket.on("move", (move) => {
        // Update the game state based on the move
        console.log(`Received move: ${move}`);
        const room = Array.from(socket.rooms)[1];
        const resp = this.games[room].doMove(move);
        if (!resp) {
          // If the move was invalid, send an error message
          socket.emit("error", "Invalid move");
        }
        console.log(`Transmitting game state ${this.games[room]}`);
        this.io.emit("gameState", this.games[room]);
      });

      // Handle a disconnect
      socket.on("disconnect", () => {
        console.log("Client disconnected");
        this.removeDeadGames();
      });
    });

    this.server.listen(port, () => console.log(`Listening on port ${port}`));
  }

  async startGame(room) {
    const numPlayers = (await this.io.in(room).allSockets()).size;
    console.log(`Starting game in room ${room} with ${numPlayers} players`);
    this.games[room] = this.GameLogic.New(numPlayers);
    this.io.to(room).emit("gameState", this.games[room]);
  }

  async removeDeadGames() {
    const rooms = Object.keys(this.games);
    for (const room of rooms) {
      const numPlayers = (await this.io.in(room).allSockets()).size;
      if (numPlayers === 0) {
        delete this.games[room];
        console.log(`Deleted room ${room}`);
      }
    }
  }
}

export const DEFAULT_PORT = process.env.PORT || 4001;
