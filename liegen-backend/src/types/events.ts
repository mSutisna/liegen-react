import { CardRanks, StartGameTypes } from "../constants.js"
import { Card, Player } from "./general.js"

export interface EventCallBust {
  playerToCallBustIndex: number,
  setPlayerIndex: number,
  playerToGiveCardsToIndex: number,
  playerToSwitchToIndex: number,
  cards: Array<Card>
  setActualCards: Array<Card>,
  gameOver: boolean
}

export interface EventMakeSet {
  prevPlayerIndex: number,
  currentPlayerIndex: number,
  rank: CardRanks,
  amount: number,
  cardsData: Array<Card>
}

export interface EventReceiveCard {
  player: Player,
  card: Card
}

export interface EventStartGame {
  sessionIDs?: Array<string>,
  type: StartGameTypes
}