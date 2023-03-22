export interface CardInterface {
  rank: string,
  suit: string,
  selected: boolean,
  faceDown: boolean,
  received: boolean,
  originIndex: number | null,
}

export interface BaseCardInterface {
  rank: string,
  suit: string,
  faceDown: boolean
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
  supposedCards: Array<BaseCardInterface> 
}

export interface MiddleInterface {
  set: SetInterface | null,
  previousCards: Array<BaseCardInterface>
}

export interface Point {
  x: number,
  y: number
}

export interface AnimationChain {
  element: HTMLElement | null,
  startPoint: Point,
  endPoint: Point
}

export interface CardUrls {
  [k: string]: string
}