import { type Socket } from "socket.io";

export const CREATE_SESSION = 'create_session';

export interface SocketWithExtraData extends Socket {
  data: {
    sessionID?: string
    userID?: string
    handlersState?: HANDLERS_STATE
  }
}

export enum HANDLERS_STATE {
  ENTER_USERNAME = 'enterUsername',
  LOBBY = 'lobby',
  GAME = 'game'
}

export interface LobbyPlayerData {
  userID: string,
  username: string,
  connected: boolean,
  ready: boolean,
}

export const EVENT_START_GAME = 'start_game';
export const EVENT_RECEIVE_CARD = 'receive_card';
export const EVENT_MAKE_SET = 'make_set';
export const EVENT_MAKE_SET_RESPONSE = 'make_set_response';
export const EVENT_CALL_BUST = 'call_bust';
export const EVENT_CALL_BUST_RESPONSE = 'call_bust_response';
export const EVENT_SET_PLAYER_TURN = 'set_player_turn';
export const EVENT_MOVE_SET_TO_MIDDLE = 'move_set_to_middle';
export const EVENT_RESET_TO_LOBBY = 'reset_to_lobby';