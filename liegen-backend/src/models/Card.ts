import { Card as CardType } from '../types/general.js';

export default class Card {
  suit: string;
  rank: string;
  selected: boolean;

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  serialize() : CardType  {
    return {
      rank: this.rank,
      suit: this.suit,
      selected: this.selected
    }
  }

  getSuit() {
    return this.suit;
  }

  getRank() {
    return this.rank;
  }

  getSelected() {
    return this.selected;
  }
};