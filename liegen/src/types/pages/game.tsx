import { CardRanks } from "../../constants";
import { BaseCardInterface, CardInterface } from "../models";
import { ReceiveCardPayload } from "../redux/game";
import { LobbyPlayerData } from "./lobby";

export const PLAYERS_GAME_CHANGE_RESPONSE = 'playersGameChangeResponse';
export const GAME_LOADED = 'gameLoaded';
export const GAME_LOADED_RESPONSE = 'gameLoadedResponse';
export const RECEIVE_CARD_RESPONSE = 'receiveCardResponse'
export const MAKE_SET = 'makeSet';
export const MAKE_SET_RESPONSE = 'makeSetResponse';
export const CALL_BUST = 'callBust';
export const CALL_BUST_RESPONSE = 'callBustResponse';
export const RESET_TO_LOBBY_RESPONSE = 'resetToLobbyResponse';


export type HandlePlayersGameChangeResponse = (data: {players: Array<LobbyPlayerData>}) => void
export type HandleGameLoadedResponse = () => void;
export type HandleReceiveCardResponse = (data: ReceiveCardPayload) => void;
export type HandleMakeSetResponse = (data: MakeSetDataResponse) => void;
export type HandleCallBustResponse = (data: CallBustResponse) => void;
export type HandleResetToLobbyResponse = (data: ResetToLobbyResponse) => void;


export interface MakeSetData {
  playerIndex: number,
  cards: Array<CardInterface>,
  rank: string,
  amount: number,
}

export interface MakeSetDataResponse {
  error?: string,
  prevPlayerIndex: number,
  currentPlayerIndex: number,
  rank: string,
  amount: number,
  cardsData: Array<CardInterface>,
  userID: string
}

export interface CallBustResponse {
  error?: string,
  playerToCallBustIndex: number,
  setPlayerIndex: number,
  playerToGiveCardsToIndex: number,
  playerToSwitchToIndex: number,
  cards: Array<BaseCardInterface>,
  setActualCards: Array<BaseCardInterface>, 
  gameOver: boolean
}

export interface ResetToLobbyResponse {
  redirect: boolean,
  playerWhoWonIndex: number,
  secondsLeftToReset: number,
}