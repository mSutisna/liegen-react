import { Player } from '../../types/props';

export interface initialState {
  userData: {
    sessionID?: string,
    userID?: string,
  },
  gameData: {
    players: Array<Player>,
    playingGame?: boolean
  },
  connectedWithServer: boolean | null
}