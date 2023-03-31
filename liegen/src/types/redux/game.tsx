import { 
  PlayerInterface, 
  MiddleInterface,  
  MessageModalData, 
  Point, 
  BaseCardInterface,
  RegularPlayerInterface, 
  PrimaryPlayerInterface,
  PrimaryPlayerViewInterface,
  RegularPlayerViewInterface
} from '../models';

interface InitialState {
  players: Array<PrimaryPlayerInterface>;
  playersView: Array<PrimaryPlayerViewInterface>;
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
  originPoint?: Point | null,
  receivingPlayerIndex: number,
  card: BaseCardInterface,
}

export interface ToggleCardSelectedPayload {
  cardName: string,
  playerIndex: number,
}

export interface MakeSetPayload {
  receivingPlayerIndex: number,
  cards: Array<BaseCardInterface>,
  rank: string,
  amount: number,
}

export interface CallBustPayload {
  playerToCallBustIndex: number 
}

const UpdateGameAction: string = "Game";

export default InitialState;
export { UpdateGameAction };