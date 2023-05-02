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