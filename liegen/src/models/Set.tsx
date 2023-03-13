import { BaseCardInterface, SetInterface } from '../types/models';
import BaseModel from './BaseModel';

export default class Set extends BaseModel implements SetInterface {
  rank: string;
  amount: number;
  playerIndex: number;
  realCards: BaseCardInterface[];
  supposedCards: BaseCardInterface[];

  constructor(
    rank: string,
    amount: number,
    playerIndex: number,
    realCards: BaseCardInterface[],
    supposedCards: BaseCardInterface[]
  ) {
    super();
    this.rank = rank;
    this.amount = amount;
    this.playerIndex = playerIndex;
    this.realCards = realCards;
    this.supposedCards = supposedCards;
  }
}