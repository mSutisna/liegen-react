import { type Server } from "socket.io";
import { sessionStore } from "../utils/SessionStore.js";

import { PLAYERS_CHANGE } from '../types/socket-types/lobby.js'
import { LobbyPlayerData } from "../types/socket-types/general.js";

export const sendPlayerChangesLobby = (io: Server) => {
  const playersPayload = createPlayersLobbyDataPayload();
  io.emit(PLAYERS_CHANGE, playersPayload)
}

export const createPlayersLobbyDataPayload = () => {
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
  return {
    players
  }
}