export interface CardInterface {
  rank: string | null,
  suit: string | null,
  selected: boolean,
  faceDown: boolean,
  received: boolean,
  originIndex: number | null,
}

export interface MiddleCardInterface {
  rank: string | null,
  suit: string | null,
  faceDown: boolean
}

export interface PlayerInterface {
  name: string,
  cards: Array<CardInterface>
}

export interface SetInterface {
  rank: string,
  amount: number,
  realCards: Array<MiddleCardInterface>,
  supposedCards: Array<MiddleCardInterface> 
}

export interface MiddleInterface {
  set: SetInterface | null,
  previousCards: Array<MiddleCardInterface>
}