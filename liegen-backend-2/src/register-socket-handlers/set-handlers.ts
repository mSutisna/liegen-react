import { type Server } from "socket.io"
import { SocketWithExtraData, HANDLERS_STATE } from "../types/socket-types/general.js"
import { unregisterUsernameHandlers, registerEnterUsernameHandlers } from "./enter-username.js"
import { unregisterLobbyHandlers, registerLobbyHandlers } from "./lobby.js"
import { unregisterGameHandlers, registerGameHandlers } from "./game.js"

export const setHandlers = (io: Server, socket: SocketWithExtraData, newHandlersState: HANDLERS_STATE) => {
  if (socket.data.handlersState) {
    unregisterHandlers(socket, socket.data.handlersState);
  }
  registerHandlers(io, socket, newHandlersState)
  socket.data.handlersState = newHandlersState;
}

const unregisterHandlers = (socket: SocketWithExtraData, oldHandlersState: HANDLERS_STATE) => {
  switch (oldHandlersState) {
    case HANDLERS_STATE.ENTER_USERNAME:
      unregisterUsernameHandlers(socket);
      break;
    case HANDLERS_STATE.LOBBY:
      unregisterLobbyHandlers(socket);
      break;
    case HANDLERS_STATE.GAME:
      unregisterGameHandlers(socket);
      break;
  }
}

const registerHandlers = (io: Server, socket: SocketWithExtraData, newHandlersState: HANDLERS_STATE) => {
  switch (newHandlersState) {
    case HANDLERS_STATE.ENTER_USERNAME:
      registerEnterUsernameHandlers(io, socket);
      break;
    case HANDLERS_STATE.LOBBY:
      registerLobbyHandlers(io, socket);
      break;
    case HANDLERS_STATE.GAME:
      registerGameHandlers(io, socket);
      break;
  }
}