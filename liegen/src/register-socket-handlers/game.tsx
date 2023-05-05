import socket from "../utilities/Socket";
import { 
  MAKE_SET_RESPONSE,
  CALL_BUST_RESPONSE,
  HandleReceiveCardResponse,
  HandleMakeSetResponse,
  HandleCallBustResponse,
  HandleResetToLobbyResponse,
  RECEIVE_CARD_RESPONSE,
  RESET_TO_LOBBY_RESPONSE,
  PLAYERS_GAME_CHANGE_RESPONSE,
  HandlePlayersGameChangeResponse,
} from "../types/pages/game";

export const registerGameHandlers = (
  playersGameChangeCallback: HandlePlayersGameChangeResponse,
  receiveCardCallback: HandleReceiveCardResponse,
  makeSetCallback: HandleMakeSetResponse,
  callBustCallback: HandleCallBustResponse,
  resetToLobbyCallback: HandleResetToLobbyResponse
) => {
  socket.on(
    PLAYERS_GAME_CHANGE_RESPONSE, 
    playersGameChangeCallback
  );
  socket.on(
    RECEIVE_CARD_RESPONSE,
    receiveCardCallback
  );
  socket.on(
    MAKE_SET_RESPONSE, 
    makeSetCallback
  );
  socket.on(
    CALL_BUST_RESPONSE,
    callBustCallback
  )
  socket.on(
    RESET_TO_LOBBY_RESPONSE,
    resetToLobbyCallback
  )
}

export const unregisterGameHandlers = () => {
  socket.off(PLAYERS_GAME_CHANGE_RESPONSE);
  socket.off(RECEIVE_CARD_RESPONSE);
  socket.off(MAKE_SET_RESPONSE);
  socket.off(CALL_BUST_RESPONSE);
  socket.off(RESET_TO_LOBBY_RESPONSE);
}
