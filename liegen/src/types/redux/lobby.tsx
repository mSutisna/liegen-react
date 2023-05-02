import { LobbyPlayerData } from "../pages/lobby"

export interface LobbyState {
  userID: string | null,
  players: Array<LobbyPlayerData>,
  gameStarted: boolean
}

export const START = 'start';
export const START_RESPONSE = 'startResponse';