import { CardRanks } from "../constants.js";

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

export interface SerializedPlayercard extends PlayerCard {
  rank: string | null,
  suit: string | null
}

export interface PlayerCardFrontend {
  rankIndex: number,
  suitIndex: number,
  selected: boolean
}

export interface SerializedPlayer {
  sessionData: SessionData,
  cards: Array<SerializedPlayercard>,
}

export interface SerializedMiddle {
  cards: Array<BaseCard>,
  set: SerializedSet
}

export interface SerializedSet {
  player: SerializedPlayer,
  rank: CardRanks,
  amount: number,
  actualCards: Array<BaseCard>;
}

export interface SerializedGame  {
  players: Array<SerializedPlayer>,
  middleData: SerializedMiddle,
  selectedPlayerIndex: number,
  playerIndex: number,
  userID: string,
  gameOver: boolean,
  playerIndexWhoWon: number | null,
}