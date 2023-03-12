import { CardInterface } from '../types/models';
import BaseModel from './BaseModel';

export default class Card extends BaseModel implements CardInterface {
  rank: string | null;
  suit: string | null;
  selected: boolean;
  faceDown: boolean;
  received: boolean;
  originIndex: number | null;

  constructor(
    rank: string | null,  
    suit: string | null,
    selected: boolean,
    faceDown: boolean,
    received: boolean,
    originIndex: number
  ) {
    super();
    this.rank = rank;
    this.suit = suit;
    this.selected = selected;
    this.faceDown = faceDown;
    this.received = received;
    this.originIndex = originIndex;
  }
}