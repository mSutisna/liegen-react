import { PlayerCard } from "../types/data.js";

export default class Card {
  suit: string;
  rank: string;
  selected: boolean;

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  serialize() : PlayerCard  {
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