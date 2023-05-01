import { type Server } from "socket.io"
import { CREATE_SESSION, HANDLERS_STATE, SocketWithExtraData } from "../types/socket-types/general.js"
import { REGISTER, REGISTER_RESPONSE, CONTINUE_TO_LOBBY, CONTINUE_TO_GAME } from "../types/socket-types/enter-username.js"
import { v4 as uuidv4 } from 'uuid';
import { sessionStore } from "../utils/SessionStore.js";
import { MAX_AMOUNT_OF_PLAYERS } from '../constants.js'
import { SessionData } from "../types/data.js";
import { sendPlayerChangesLobby, createPlayersLobbyDataPayload } from "./general.js";
import { setHandlers } from "./set-handlers.js";

export const registerEnterUsernameHandlers = (io: Server, socket: SocketWithExtraData) => {
  socket.on(REGISTER, data => registerCallback(io, socket, data))
}

export const unregisterUsernameHandlers = (socket: SocketWithExtraData) => {
  socket.removeAllListeners(REGISTER);
}

const registerCallback = (io: Server, socket: SocketWithExtraData, { username }) => {
  let sessions = sessionStore.findAllSessions();
    for (const session of sessions) {
      if (session.username === username) {
        socket.emit(REGISTER_RESPONSE, {
          error: 'The username has already been taken',
        })
        return;
      }
    }
    let connectedSessionsCount = 0;
    for (const session of sessions) {
      if (session.connected) {
        connectedSessionsCount++;
      }
    }
    if (connectedSessionsCount >= MAX_AMOUNT_OF_PLAYERS) {
      socket.emit(REGISTER_RESPONSE, {
        error: 'The maximum amount of players are already in the lobby',
      })
      return;
    }

    socket.data.sessionID = uuidv4();
    socket.data.userID = uuidv4();

    const sessionData : SessionData = {
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
      username: username,
      connected: true,
      ready: false,
      gameLoaded: false
    };
    sessionStore.saveSession(socket.data.sessionID, sessionData);

    socket.emit(CREATE_SESSION, {
      sessionID: socket.data.sessionID,
    });

    const playersLobbyPayload = createPlayersLobbyDataPayload();
    socket.emit(REGISTER_RESPONSE, {
      userID: socket.data.userID,
      ...playersLobbyPayload
    });
    sendPlayerChangesLobby(io);
    setHandlers(io, socket, HANDLERS_STATE.LOBBY);
}


