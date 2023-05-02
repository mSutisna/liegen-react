import socket from "../utilities/Socket";
import { 
  GAME_LOADED_RESPONSE, 
  MAKE_SET_RESPONSE,
  CALL_BUST_RESPONSE,
  GAME_OVER_RESPONSE,
  HandleReceiveCardResponse,
  HandleMakeSetResponse,
  HandleCallBustResponse,
  HandleGameOverResponse,
  RECEIVE_CARD_RESPONSE
} from "../types/pages/game";

export const registerGameHandlers = (
  receiveCardCallback: HandleReceiveCardResponse,
  makeSetCallback: HandleMakeSetResponse,
  callBustCallback: HandleCallBustResponse,
  gameOverCallback: HandleGameOverResponse
) => {
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
    GAME_OVER_RESPONSE,
    gameOverCallback
  )
}

export const unregisterGameHandlers = () => {
  socket.off(RECEIVE_CARD_RESPONSE);
  socket.off(MAKE_SET_RESPONSE);
  socket.off(CALL_BUST_RESPONSE);
  socket.off(GAME_OVER_RESPONSE);
}
