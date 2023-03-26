import { PlayerInterface, MiddleInterface, CardInterface, MessageModalData } from '../models';

interface InitialState {
  players: Array<PlayerInterface>;
  middle: MiddleInterface,
  mainPlayerIndex: number,
  currentPlayerIndex: number;
  previousPlayerIndex: number | null,
  cardUrls: {[k: string]: string},
  messageModal: MessageModalData,
  clockwise: boolean
}

export interface MessageModalPayload {
  message: string,
  modalAnimation?: string,
  disableCloseButton?: boolean
}

export interface ReceiveCardPayload {
  originPlayerIndex: number,
  receivingPlayerIndex: number,
  card: CardInterface
}

export interface MakeSetPayload {
  receivingPlayerIndex: number,
  cards: Array<CardInterface>,
  rank: string,
  amount: number,
}

export interface CallBustPayload {
  playerToCallBustIndex: number 
}

const UpdateGameAction: string = "Game";

export default InitialState;
export { UpdateGameAction };