import type Card from './Card.js';
import type Set from './Set.js';
class Middle {
  cards: Array<Card>;
  set: Set | null;

  constructor(cards: Array<Card> = [], set: Set | null = null) {
    this.cards = cards;
    this.set = set;
  }

  reset() {
    this.cards = [];
    this.set = null;
  }

  serialize() {
    const cards = [];
    for (const card of this.cards) {
      cards.push(card.serialize())
    }
    let serializedSet = null;
    if (this.set) {
      serializedSet = this.set.serialize();
    }
    return {
      cards,
      set: serializedSet
    }
  }

  convertLastSetToCards() {
    if (this.set) {
      this.convertSetToCards(this.set);
    }
  }

  convertSetToCards(set: Set) {
    const cards = set.getActualCards();
    for (const card of cards) {
      this.cards.push(card);
    }
  }

  setSet(set: Set) {
    this.convertLastSetToCards();
    this.set = set;
  }

  getSet() {
    return this.set;
  }

  getCards() {
    return this.cards;
  }

  getData() {
    return {
      cards: this.cards,
      set: this.set
    }
  }
};

export default Middle;