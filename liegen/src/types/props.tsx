import { CardForPlayerInterface } from "./models";

export interface HandProps {
  name: string,
  index: number,
  realIndex: number,
  amountOfPlayers: number,
  gameWidth: number,
  gameHeight: number,
  cards: Array<CardForPlayerInterface>,
  selectedRank: number,
  assignIndicatorRefToCollection: (element: HTMLImageElement | null, index: number) => void
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

export interface MoreCardsIndicatorProps {
  amount: number
}

export interface AllCardsOverlay {
  amount: number
}

export interface Player {
  userID: string,
  username: string,
  connected: boolean,
  ready: boolean,
}

export type toggleModal = () => void
export type setSaving = (status: boolean) => void
export type setModalMessage = (message: string) => void
export type setUserDataDispatch = (data: {}) => void
export type setPlayersDataDispatch = (players: Array<Player>) => void
export type setGameDataDispatch = (data: {}) => void