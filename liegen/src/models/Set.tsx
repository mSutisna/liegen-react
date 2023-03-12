import { MiddleCardInterface, SetInterface } from '../types/models';
import BaseModel from './BaseModel';

export default class Set extends BaseModel implements SetInterface {
  rank: string;
  amount: number;
  realCards: MiddleCardInterface[];
  supposedCards: MiddleCardInterface[];

  constructor(
    rank: string,
    amount: number,
    realCards: MiddleCardInterface[],
    supposedCards: MiddleCardInterface[]
  ) {
    super();
    this.rank = rank;
    this.amount = amount;
    this.realCards = realCards;
    this.supposedCards = supposedCards;
  }
}