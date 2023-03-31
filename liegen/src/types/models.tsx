import { CardRanks, CardSuits } from "../constants";

export interface BaseCardInterface {
  rankIndex: CardRanks,
  suitIndex: CardSuits,
  faceDown: boolean,
}

export interface RegularCardInterface extends BaseCardInterface {
  originPoint: Point | null,
  receiveAnimationStatus: AnimationStatus,
}

export interface PrimaryCardInterface extends RegularCardInterface {
  selected: boolean,
}

export interface PlayerInterface {
  name: string,
  originPoint: Point | null
}

export interface RegularPlayerInterface extends PlayerInterface {
  cards: Array<RegularCardInterface>,
}

export interface PrimaryPlayerInterface extends PlayerInterface { 
  cards: Array<PrimaryCardInterface>,
  selectedRank: number,
}

export interface PrimaryPlayerViewInterface extends PrimaryPlayerInterface  {
  index: number,
}

export interface RegularPlayerViewInterface extends RegularPlayerInterface {
  index: number,
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

export interface MessageModalData {
  visible: boolean,
  message: string,
  modalAnimation: string,
  disableCloseButton: boolean
}
