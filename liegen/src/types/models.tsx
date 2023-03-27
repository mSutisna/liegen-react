export interface CardInterface {
  rank: string,
  suit: string,
  selected: boolean,
  faceDown: boolean,
  received: boolean,
  originIndex: number | null,
  receiveAnimationPlayed: boolean,
}

export interface BaseCardInterface {
  rank: string,
  suit: string,
  faceDown: boolean,
}

export interface PlayerInterface {
  name: string,
  cards: Array<CardInterface>,
  selectedRank: number,
  xPoint: number,
  yPoint: number,
}

export interface SetInterface {
  rank: string,
  amount: number,
  playerIndex: number,
  realCards: Array<BaseCardInterface>,
  supposedCards: Array<BaseCardInterface>,
  animationFinished: boolean 
}

export interface MiddleInterface {
  set: SetInterface | null,
  previousSet: SetInterface | null,
  burnedCards: Array<BaseCardInterface>,
  playerToCallBust: number | null,
  bustAnimationStatus: string,
}

export interface Point {
  x: number,
  y: number
}

export interface AnimationChain {
  element: HTMLElement | null,
  animationInstructions: Array<{[k: string]: string | number}>,
  animationSettings?: {[k: string]: number | string}
  dontMakeVisible?: boolean,
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
