export interface SessionData {
  sessionID: string,
  userID: string,
  username: string,
  connected: boolean,
  ready: boolean,
  gameLoaded: boolean
}

export interface BaseCard {
  rank: string,
  suit: string,
}

export interface PlayerCard extends BaseCard {
  selected: boolean
}

export interface SerializedPlayer {
  sessionData: SessionData,
  cards: Array<PlayerCard>,
}