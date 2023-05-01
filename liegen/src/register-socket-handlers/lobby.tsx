import socket from "../utilities/Socket";
import { 
  PLAYERS_CHANGE, 
  START_RESPONSE,
  DEFINITIVE_START,
  HandleStartResponseCallback,
  HandlePlayersChangeCallback,
  HandleDefinitiveStartCallback,
} from "../types/pages/lobby";

export const registerLobbyHandlers = (
  playersChangeCallback: HandlePlayersChangeCallback,
  startResponseCallback: HandleStartResponseCallback,
  definitiveStart: HandleDefinitiveStartCallback,
) => {
  socket.on(
    PLAYERS_CHANGE,
    playersChangeCallback
  );
  socket.on(
    START_RESPONSE, 
    startResponseCallback
  );
  socket.on(
    DEFINITIVE_START,
    definitiveStart
  )
}

export const unregisterLobbyHandlers = () => {
  socket.off(PLAYERS_CHANGE);
  socket.off(START_RESPONSE);
  socket.off(DEFINITIVE_START);
}
