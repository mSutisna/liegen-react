import { CardRanks } from "../../constants";
import { CardInterface } from "../models";
import { ReceiveCardPayload } from "../redux/game";

export const GAME_LOADED = 'gameLoaded';
export const GAME_LOADED_RESPONSE = 'gameLoadedResponse';
export const RECEIVE_CARD_RESPONSE = 'receiveCardResponse'
export const MAKE_SET = 'makeSet';
export const MAKE_SET_RESPONSE = 'makeSetResponse';
export const CALL_BUST = 'callBust';
export const CALL_BUST_RESPONSE = 'callBustResponse';
export const GAME_OVER = 'gameOver';
export const GAME_OVER_RESPONSE = 'gameOverResponse';


export type HandleGameLoadedResponse = () => void;
export type HandleReceiveCardResponse = (data: ReceiveCardPayload) => void;
export type HandleMakeSetResponse = (data: MakeSetDataResponse) => void;
export type HandleCallBustResponse = () => void;
export type HandleGameOverResponse = () => void;


export interface MakeSetData {
  playerIndex: number,
  cards: Array<CardInterface>,
  rank: CardRanks,
  amount: number,
}

export interface MakeSetDataResponse {
  error?: string,
  prevPlayerIndex: number,
  currentPlayerIndex: number,
  rank: CardRanks,
  amount: number,
  cardsData: Array<CardInterface>,
  userID: string
}