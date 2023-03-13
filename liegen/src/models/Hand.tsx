import { CardInterface, PlayerInterface } from '../types/models';
import BaseModel from './BaseModel';

export default class Hand extends BaseModel implements PlayerInterface {
  name: string;
  cards: CardInterface[];
  selectedRank: number;
  xPoint: number;
  yPoint: number;

  constructor(name: string, cards: Array<CardInterface>, selectedRank: number, xPoint: number, yPoint: number) {
    super();
    this.name = name;
    this.cards = cards ?? [];
    this.selectedRank = selectedRank ?? 0;
    this.xPoint = xPoint;
    this.yPoint = yPoint;
  }

  receiveCard(card: CardInterface) {
    this.cards.push(card);
  }
}