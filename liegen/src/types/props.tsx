import { CardInterface } from "./models";

export interface HandProps {
  name: string,
  index: number,
  realIndex: number,
  amountOfPlayers: number,
  gameWidth: number,
  gameHeight: number,
  cards: Array<CardInterface>,
  selectedRank: number
}

export interface ModalProps {
  isShowing: boolean, 
  hide: () => {}, 
  modalAnimation: string,
  message: string,
  disableCloseButton: boolean
}


export interface MessageModalInnerProps {
  message: string,
  modalDisplayAnimation: string,
  disableCloseButton: boolean
}