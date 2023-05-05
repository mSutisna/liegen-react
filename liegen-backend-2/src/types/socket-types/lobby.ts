import { LobbyPlayerData } from "./general.js";

export const DISCONNECT = 'disconnect';
export const PLAYERS_CHANGE = 'playersChange';
export const READY_CHANGE = 'readyChange';
export const START = 'start';
export const START_RESPONSE = 'startResponse';
export const DEFINITIVE_START = 'definitiveStart';

export interface CONTINUE_TO_LOBBY_DATA {
  userID: string,
  players: Array<LobbyPlayerData>,
}