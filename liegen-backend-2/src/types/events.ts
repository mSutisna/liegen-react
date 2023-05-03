import { CardRanks } from "../constants.js"
import type Card from "../models/Card.js"
import { SerializedPlayer, PlayerCard } from "./data.js"

export interface EventReceiveCard {
  player: SerializedPlayer,
  card: PlayerCard
}

export interface EventMakeSet {
  prevPlayerIndex: number,
  currentPlayerIndex: number,
  rank: CardRanks,
  amount: number,
  cardsData: Array<Card>,
}