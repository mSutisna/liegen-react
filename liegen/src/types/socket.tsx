import { BaseCardInterface } from "./models";

export const CREATE_SESSION = 'create_session';

export interface SetResponseInterface {
  error?: string,
  prevPlayerIndex: number,
  cardsData: Array<BaseCardInterface>,
  currentPlayerIndex: number,
  rank: string,
  amount: number
}

export interface ReceiveCardDataResponseInterface {
  cardData: {
    rank: string,
    suit: string
  },
  playerIndex: number
}