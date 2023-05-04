import Card from './Card.js';
import { SUITS, RANKS, CardSuits } from '../constants.js';
import type Player from './Player.js';
import { PlayerCard } from '../types/data.js';

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
    const cards: Array<PlayerCard> = [];
    for (const card of this.cards) {
      cards.push(card.serialize())
    }
    return cards;
  }

  resetDeckOfCards() {
    this.cards = [];
    this.generateDeckOfCards();
    this.shuffleDeck();
    this.checkCards();
  }

  checkCards() {
    const indexes: {[k: string]: number} = {};
    for (const card of this.cards) {
      const key = `${card.getSuit()}-${card.getRank()}`
      if (!indexes[key]) {
        indexes[key] = 0;
      }
      indexes[key] += 1;
    }
    const duplicateKeys = {};
    for (const [key, value] of Object.entries(indexes)) {
      if (value > 1) {
        duplicateKeys[key] = value;
      }
    }
  }

  generateDeckOfCards() {
    this.constructSuit(CardSuits.CLUBS);
    this.constructSuit(CardSuits.DIAMONDS);
    this.constructSuit(CardSuits.HEARTS);
    this.constructSuit(CardSuits.SPADES);
  }

  constructSuit(suit: CardSuits) {
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

  dealCards(players: Array<Player>) {
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