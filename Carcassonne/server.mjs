/**
 * Run this server using
 * ```sh
 * node Carcassonne/server.mjs
 * ```
 */
import {Server, DEFAULT_PORT} from "../util/server.mjs";
import { GameState } from "./game-logic.js";

const server = new Server(GameState);
server.start(DEFAULT_PORT);
