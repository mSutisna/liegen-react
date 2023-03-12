import { CardInterface, PlayerInterface } from '../types/models';
import BaseModel from './BaseModel';

export default class Hand extends BaseModel implements PlayerInterface {
  name: string;
  cards: CardInterface[];

  constructor(name: string, cards: Array<CardInterface>) {
    super();
    this.name = name;
    this.cards = cards ?? [];
  }

  receiveCard(card: CardInterface) {
    this.cards.push(card);
  }
}