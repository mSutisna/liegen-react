import { 
  PlayerInterface, 
  MiddleInterface,  
  MessageModalData, 
  Point, 
  BaseCardInterface
} from '../models';

interface InitialState {
  players: Array<PlayerInterface>;
  playersOrder: Array<number>,
  middle: MiddleInterface,
  mainPlayerIndex: number,
  currentPlayerIndex: number;
  previousPlayerIndex: number | null,
  cardUrls: {[k: string]: string},
  cardUrlsRegular: {[k: string]: string},
  cardUrlsMobile: {[k: string]: string},
  messageModal: MessageModalData,
  clockwise: boolean,
  allCardsModalVisible: boolean
}

export enum ModalAnimationType {
  WIN = 'one',
  REGULAR = 'three'
}

export interface MessageModalPayload {
  message: string,
  modalAnimation?: ModalAnimationType,
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