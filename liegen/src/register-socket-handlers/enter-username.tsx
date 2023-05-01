import socket from "../utilities/Socket";
import { 
  REGISTER_RESPONSE, 
  REGISTER_RESPONSE_DATA, 
  CONTINUE_TO_LOBBY, 
  CONTINUE_TO_LOBBY_DATA,
  CONTINUE_TO_GAME,
  CONTINUE_TO_GAME_DATA 
} from "../types/pages/enter-username";
import { establishSocketConnection } from "../utilities/Socket";

export type HandleRegisterCallbackSuccessType = (data: REGISTER_RESPONSE_DATA) => void;
export type HandleErrorType = (message: string) => void;
export type HandleContinueToLobby = (data: CONTINUE_TO_LOBBY_DATA) => void;
export type HandleContinueToGame = (data: CONTINUE_TO_GAME_DATA) => void;

export const registerEnterUsernameHandlers = (
  handleRegisterCallbackSuccess: HandleRegisterCallbackSuccessType,
  handleError: (message: string) => void,
  handleContinueToLobby: HandleContinueToLobby,
  handleContinueToGame: HandleContinueToGame
) => {
  socket.on(
    REGISTER_RESPONSE, 
    data => registerCallbackCallback(
      data, 
      handleRegisterCallbackSuccess, 
      handleError
    )
  )
  socket.on(
    CONTINUE_TO_LOBBY,
    handleContinueToLobby
  )
  socket.on(
    CONTINUE_TO_GAME,
    handleContinueToGame
  )
  establishSocketConnection();
}

export const unregisterEnterUsernameHandlers = () => {
  socket.off(REGISTER_RESPONSE);
  socket.off(CONTINUE_TO_LOBBY);
  socket.off(CONTINUE_TO_GAME);
}

const registerCallbackCallback = (
  data: REGISTER_RESPONSE_DATA,
  handleRegisterCallbackSuccess: HandleRegisterCallbackSuccessType,
  handleError: (message: string) => void,
) => {
  if (data.error) {
    if (data.removeSessionId) {
      sessionStorage.removeItem('sessionID');
    }
    handleError(data.error);
    return;
  }
  handleRegisterCallbackSuccess(data);
}