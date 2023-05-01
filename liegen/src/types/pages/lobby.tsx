export const PLAYERS_CHANGE = 'playersChange';
export const READY_CHANGE = 'readyChange';
export const START = 'start';
export const START_RESPONSE = 'startResponse';
export const DEFINITIVE_START = 'definitiveStart';

export interface LobbyPlayerData {
  userID: string,
  username: string,
  connected: boolean,
  ready: boolean,
}


export type HandlePlayersChangeCallback = (data: {players: Array<LobbyPlayerData>}) => void;
export type HandleStartResponseCallback = (data: {error: string}) => void;
export type HandleDefinitiveStartCallback = (data: {players: Array<LobbyPlayerData>}) => void;