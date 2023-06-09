import { type Server } from "socket.io"
import { SocketWithExtraData } from "../types/socket-types/general.js"
import { gameEventEmitter } from "../utils/GameEventEmitter.js";
import { sessionStore } from "../utils/SessionStore.js";
import { game } from "../models/Game.js"
import { GAME_LOADED, MAKE_SET, CALL_BUST, GAME_OVER, MakeSetData, CallBustData } from "../types/socket-types/game.js";
import { DISCONNECT } from "../types/socket-types/lobby.js";
import { disconnectListener } from "./general.js";

export const registerGameHandlers = (io: Server, socket: SocketWithExtraData) => {
  gameEventEmitter.setGame(game);
  gameEventEmitter.setSessionStore(sessionStore);
  socket.on(GAME_LOADED, () => gameLoadedCallback(io, socket));
  socket.on(MAKE_SET, makeSetCallBack);
  socket.on(CALL_BUST, callBustCallback);
  socket.on(GAME_OVER, gameOverCallBack);
  socket.on(DISCONNECT, () => {
    disconnectListener(io, socket)
  })
}

export const unregisterGameHandlers = (socket: SocketWithExtraData) => {
  socket.removeAllListeners(GAME_LOADED);
  socket.removeAllListeners(MAKE_SET);
  socket.removeAllListeners(CALL_BUST);
  socket.removeAllListeners(GAME_OVER);
  socket.removeAllListeners(DISCONNECT);
}

const gameLoadedCallback = (io: Server, socket: SocketWithExtraData) => {
  const playerSession = sessionStore.findSession(socket.data.sessionID);
  playerSession.gameLoaded = true;
  sessionStore.saveSession(socket.data.sessionID, playerSession);
  const sessions = sessionStore.findAllSessions();
  for (const session of sessions) {
    if (!session.gameLoaded) {
      return;
    }
  }
  game.dealCards();
}

const makeSetCallBack = (data: MakeSetData) => {
  game.receiveSet(data)
}

const callBustCallback = (data: CallBustData) => {
  game.callBust(data)
}

const gameOverCallBack = () => {

}