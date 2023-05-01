import { LobbyPlayerData } from "./lobby";

export const REGISTER = 'register';
export const REGISTER_RESPONSE = 'registerResponse';
export const CONTINUE_TO_LOBBY = 'continueToLobby';
export const CONTINUE_TO_GAME = 'continueToGame';

export interface REGISTER_RESPONSE_DATA {
  error?: string,
  removeSessionId?: boolean,
  userID: string,
  players: Array<LobbyPlayerData>
}

export interface CONTINUE_TO_LOBBY_DATA {
  userID: string,
  players: Array<LobbyPlayerData>,
}

export interface CONTINUE_TO_GAME_DATA {

}