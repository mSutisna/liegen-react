import { type Server } from "socket.io"
import { SocketWithExtraData } from "../types/socket-types/general.js"
import { gameEventEmitter } from "../utils/GameEventEmitter.js";
import { sessionStore } from "../utils/SessionStore.js";
import { game } from "../models/Game.js"

export const registerGameHandlers = (io: Server, socket: SocketWithExtraData) => {
  gameEventEmitter.setGame(game);
  gameEventEmitter.setSessionStore(sessionStore);
  
}

export const unregisterGameHandlers = (socket: SocketWithExtraData) => {
  
}