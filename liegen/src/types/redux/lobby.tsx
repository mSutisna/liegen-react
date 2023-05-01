import { LobbyPlayerData } from "../pages/lobby"

export interface LobbyState {
  userID: string | null,
  players: Array<LobbyPlayerData>
}

export const START = 'start';
export const START_RESPONSE = 'startResponse';