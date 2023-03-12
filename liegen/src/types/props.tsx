import { CardInterface } from "./models";

export interface HandProps {
  name: string,
  index: number,
  amountOfPlayers: number,
  gameWidth: number,
  gameHeight: number,
  cards: Array<CardInterface>
}