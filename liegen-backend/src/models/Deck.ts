import Card from './Card.js';
import { SUITS, RANKS } from '../constants.js';

import { Card as CardType } from '../types/general.js';

export default class Deck {
  cards: Array<Card>;
  constructor(cards: Array<Card> = []) {
    if (cards.length > 0) {
      this.cards = cards;
    } else {
      this.resetDeckOfCards();
    }
  }

  serialize() {
    const cards: Array<CardType> = [];
    for (const card of this.cards) {
      cards.push(card.serialize())
    }
    return cards;
  }

  resetDeckOfCards() {
    this.cards = [];
    this.generateDeckOfCards();
    this.shuffleDeck();
  }

  generateDeckOfCards() {
    this.constructSuit('Clubs');
    this.constructSuit('Diamonds');
    this.constructSuit('Hearts');
    this.constructSuit('Spades');
  }

  constructSuit(suit: string) {
    for (let i = 0; i < RANKS.length; i++) {
      const rank = RANKS[i];
      this.cards.push(new Card(suit, rank));
    }
  }

  shuffleDeck() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }

  dealCards(players) {
    let playerIndex = 0;
    const cardsToDeal = this.cards.length;
    for (let i = 0; i < cardsToDeal; i++) {
      const player = players[playerIndex];
      const card = this.drawCard();
      player.receiveCard(card);
      playerIndex++;
      if (playerIndex > players.length - 1) {
        playerIndex = 0;
      }
    }
  }

  drawCard() {
    return this.cards.pop();
  }

  getDeckSize() {
    return this.cards.length;
  }
};