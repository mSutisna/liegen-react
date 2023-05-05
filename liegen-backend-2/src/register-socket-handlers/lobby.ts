import { type Server } from "socket.io"
import { HANDLERS_STATE, SocketWithExtraData } from "../types/socket-types/general.js"
import { sessionStore } from "../utils/SessionStore.js";
import { createPlayersDataPayload, disconnectListener } from "./general.js";
import { READY_CHANGE, START, START_RESPONSE, PLAYERS_CHANGE, DEFINITIVE_START, DISCONNECT } from "../types/socket-types/lobby.js";
import { game } from "../models/Game.js";
import { createIndexedSocketCollection } from "../utils/helper-function.js";
import { setHandlers } from "./set-handlers.js";

export const registerLobbyHandlers = (io: Server, socket: SocketWithExtraData) => {
  socket.on(READY_CHANGE, () => {
    readyListener(io, socket);
  })
  socket.on(START, () => {
    startListener(io, socket)
  })
  socket.on(DISCONNECT, () => {
    disconnectListener(io, socket)
  })
}

export const unregisterLobbyHandlers = (socket: SocketWithExtraData) => {
  socket.removeAllListeners(READY_CHANGE);
  socket.removeAllListeners(START);
  socket.removeAllListeners(DISCONNECT);
}

const readyListener = (io: Server, socket: SocketWithExtraData) => {
  const session = sessionStore.findSession(socket.data.sessionID);
  if (!session) {
    return;
  }
  session.ready = !session.ready;
  sessionStore.saveSession(socket.data.sessionID, session);
  const playersPayload = createPlayersDataPayload();
  io.emit(PLAYERS_CHANGE, {
    players: playersPayload
  })
}

const startListener = (io: Server, socket: SocketWithExtraData) => {
  let sessions = sessionStore.findAllSessions();
  const conncetedSessions = sessions.filter(session => session.connected);
  if (conncetedSessions.length < 2) {
    socket.emit(START_RESPONSE, {
      error: 'At least 2 players should be connected',
    })
    return;
  }
  for (const session of sessions) {
    if (!session.ready) {
      socket.emit(START_RESPONSE, {
        error: 'Not all players are ready',
      })
      return;
    }
  }
  for (const session of sessions) {
    if (!session.connected) {
      sessionStore.deleteSession(session.sessionID)
    }
  }

  const indexedSocketCollection = createIndexedSocketCollection(io);
  for (const socket of Object.values(indexedSocketCollection)) {
    setHandlers(io, socket, HANDLERS_STATE.GAME);
  }
  sessions = sessionStore.findAllSessions();
  game.startGame(sessions, indexedSocketCollection);
  const playersPayload = createPlayersDataPayload();

  for (const playerSocket of Object.values(indexedSocketCollection)) {
    playerSocket.emit(DEFINITIVE_START, {
      userID: playerSocket.data.userID,
      players: playersPayload,
    });
  }
}