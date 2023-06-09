import { CardRanks } from '../../constants';
import { 
  PlayerInterface, 
  MiddleInterface,  
  MessageModalData, 
  Point, 
  BaseCardInterface,
  CardInterface
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
  allCardsModalVisible: boolean,
  userID: string,
  playerIndexWhoWon: number | null,
  gameOver: boolean,
  secondsLeftToReset: number | null
}

export enum ModalAnimationType {
  WIN = 'one',
  REGULAR = 'three'
}

export interface MessageModalPayload {
  message: string,
  modalAnimation?: ModalAnimationType,
  disableCloseButton?: boolean,
  gamePaused?: boolean
}

export interface ReceiveCardPayload {
  originPoint?: Point | null,
  receivingPlayerIndex: number,
  card: CardInterface,
}

export interface MakeSetPayload {
  playerIndex: number,
  cards: Array<CardInterface>,
  rank: CardRanks,
  amount: number,
}

export interface ToggleCardSelectedPayload {
  cardName: string,
  playerIndex: number,
}

export interface CallBustPayload {
  playerToCallBustIndex: number 
}

const UpdateGameAction: string = "Game";

export default InitialState;
export { UpdateGameAction };