import { type Server } from "socket.io"
import { SocketWithExtraData } from "../types/socket-types/general.js"
import { sessionStore } from "../utils/SessionStore.js";
import { createPlayersLobbyDataPayload } from "./general.js";
import { READY_CHANGE, START, START_RESPONSE, PLAYERS_CHANGE, DEFINITIVE_START } from "../types/socket-types/lobby.js";
import { game } from "../models/Game.js";
import { createIndexedSocketCollection } from "../utils/helper-function.js";

export const registerLobbyHandlers = (io: Server, socket: SocketWithExtraData) => {
  socket.on(READY_CHANGE, () => {
    readyListener(io, socket);
  })
  socket.on(START, () => {
    startListener(io, socket)
  })
}

export const unregisterLobbyHandlers = (socket: SocketWithExtraData) => {
  socket.removeAllListeners(READY_CHANGE);
  socket.removeAllListeners(START);
}

const readyListener = (io: Server, socket: SocketWithExtraData) => {
  const session = sessionStore.findSession(socket.data.sessionID);
  if (!session) {
    console.log({session, sessionID: socket.data.sessionID})
    return;
  }
  session.ready = !session.ready;
  sessionStore.saveSession(socket.data.sessionID, session);
  const playersPayload = createPlayersLobbyDataPayload();
  io.emit(PLAYERS_CHANGE, playersPayload)
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


  const startGame = async () => {
    sessions = sessionStore.findAllSessions();
    const indexedSocketCollection = createIndexedSocketCollection(io);
    game.startGame(sessions, indexedSocketCollection);
    const playersPayload = createPlayersLobbyDataPayload();
    io.emit(DEFINITIVE_START, {
      players: playersPayload,
    });
  }
  startGame();
}