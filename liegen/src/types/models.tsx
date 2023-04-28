import { type Socket } from "socket.io-client";
import { CardRanks, CardSuits } from "../constants";
import { ModalAnimationType } from "./redux/game";

export interface BaseCardInterface {
  rankIndex: CardRanks,
  suitIndex: CardSuits,
  faceDown: boolean,
}

export interface CardForPlayerInterface extends BaseCardInterface {
  selected: boolean,
  originPoint: Point | null,
  receiveAnimationStatus: AnimationStatus,
}

export interface PlayerInterface {
  name: string,
  originPoint: Point | null,
  index: number,
  cards: Array<CardForPlayerInterface>,
  selectedRank: number,
}

export interface SetInterface {
  rank: number,
  amount: number,
  playerIndex: number,
  realCards: Array<BaseCardInterface>,
  supposedCards: Array<BaseCardInterface>,
}

export enum AnimationStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  FINISHED = 'finished'
}

export interface MiddleInterface {
  set: SetInterface | null,
  previousSet: SetInterface | null,
  burnedCards: Array<BaseCardInterface>,
  playerToCallBust: number | null,
  setAnimationStatus: AnimationStatus,
  bustAnimationStatus: AnimationStatus,
}

export interface Point {
  x: number,
  y: number
}

export interface AnimationChain {
  element: HTMLElement | null,
  executeFunction?: (element: HTMLElement | null) => Promise<void>,
  animationInstructions?: Array<{[k: string]: string | number}>,
  animationSettings?: {[k: string]: number | string}
  dontMakeVisible?: boolean,
  afterAnimationFunction?: () => Promise<void>
}

export type AnimationChainMultipleImplelmentations = AnimationChain | (() => AnimationChain);

export interface CardUrls {
  [k: string]: string
}

export interface CardUrlsComplete {
  [K: string]: {
    regular: string,
    mobile: string
  }
}

export interface MessageModalData {
  visible: boolean,
  message: string,
  modalAnimation: ModalAnimationType,
  disableCloseButton: boolean
}

export type CardPosition = {row: number, column: number};


export interface SocketExtraData extends Socket {
  sessionID?: string
  userID?: string
}