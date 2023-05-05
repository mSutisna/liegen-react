import { type Server } from "socket.io";
import { sessionStore } from "../utils/SessionStore.js";

import { PLAYERS_CHANGE } from '../types/socket-types/lobby.js'
import { PLAYERS_GAME_CHANGE_RESPONSE } from "../types/socket-types/game.js";
import { LobbyPlayerData, SocketWithExtraData } from "../types/socket-types/general.js";

export const sendPlayerChangesLobby = (io: Server) => {
  const playersPayload = createPlayersDataPayload();
  io.emit(PLAYERS_CHANGE, {
    players: playersPayload
  })
}

export const createPlayersDataPayload = () => {
  const sessions = sessionStore.findAllSessions();
  const players =  sessions.map(session => {
    const playerPayload: LobbyPlayerData = {
      connected: session.connected,
      ready: session.ready,
      username: session.username,
      userID: session.userID
    }
    return playerPayload;
  });
  return players;
}

export const sendPlayerChangesGame = (io: Server) => {
  const playersPayload = createPlayersDataPayload();
  io.emit(PLAYERS_GAME_CHANGE_RESPONSE, {
    players: playersPayload
  })
}

export const disconnectListener = (io: Server, socket: SocketWithExtraData) => {
  setSocketConnectedStatus(socket, false);
  sendPlayerChangesLobby(io);
  sendPlayerChangesGame(io);
}

export const setSocketConnected = (io: Server, socket: SocketWithExtraData) => {
  setSocketConnectedStatus(socket, true);
  sendPlayerChangesLobby(io);
  sendPlayerChangesGame(io);
}

const setSocketConnectedStatus = (socket: SocketWithExtraData, connected: boolean) => {
  const session = sessionStore.findSession(socket.data.sessionID);
  session.connected = connected;
  sessionStore.saveSession(socket.data.sessionID, session);
}
