import { gameEventEmitter } from '../utils/GameEventEmitter.js'
import { buildCardFromJsonData } from '../utils/helper-functions.js';
import {
  EVENT_RECEIVE_CARD
} from '../constants.js';

import {
  EventReceiveCard
} from '../types/events.js';

import { type Socket } from 'socket.io';

import { SessionData, Player as SerializedPlayer, Card as SerializedCard, SocketExtraData } from '../types/general.js';

import Card from './Card.js';

export default class Player {
  socket: Socket;
  name: string;
  sessionData: SessionData;
  cards: Array<Card>;
  hasTurn: boolean;

  constructor(socket: Socket, sessionData: SessionData, cards: Array<Card> = []) {
    this.socket = socket;
    this.name = sessionData.username;
    this.sessionData = sessionData;
    this.cards = cards;
    this.hasTurn = false;
  }

  serialize(noCards = false) {
    const playerSerialization: SerializedPlayer = {
      name: this.name,
      sessionData: this.sessionData,
      hasTurn: this.hasTurn,
    }
    if (!noCards) {
      const cards = [];
      for (const card of this.cards) {
        cards.push(card.serialize());
      } 
      playerSerialization.cards = cards;
    }
    return playerSerialization;
  }

  removeCards(cardsToRemove: Array<Card>) {
    const cardIndexes = {};
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      cardIndexes[this.createCardKey(card)] = i;
    }
    const indexesToRemove = [];
    for (const card of cardsToRemove) {
      const cardKey = this.createCardKey(card);
      console.log({cardKey})
      if (cardIndexes[cardKey] === undefined) {
        continue;
      }
      indexesToRemove.push(cardIndexes[cardKey]);
    }
    indexesToRemove.sort();
    indexesToRemove.reverse();
    console.log(indexesToRemove);
    for (const indexToRemove of indexesToRemove) {
      this.cards.splice(indexToRemove, 1)
    }
  }

  createCardKey(card) {
    return `${card.getSuit()}-${card.getRank()}`
  }

  getName() {
    return this.name;
  }

  getSocket(): SocketExtraData {
    return this.socket;
  }

  setSocket(socket: SocketExtraData) {
    this.socket = socket;
  }

  getSessionData() {
    return this.sessionData;
  }

  getHasTurn() {
    return this.hasTurn;
  }

  setHasTurn(hasTurn: boolean) {
    this.hasTurn = hasTurn;
  }

  getCards() {
    return this.cards;
  }

  getUserID() {
    return this.sessionData?.userID;
  }

  receiveCardsData(cardsData: Array<SerializedCard>) {
    for (const cardData of cardsData) {
      this.cards.push(new Card(cardData.suit, cardData.rank));
    }
  }

  receiveCard(card: Card) {
    this.cards.push(buildCardFromJsonData(card));
    const payload: EventReceiveCard = {
      player: this.serialize(),
      card: card.serialize()
    }
    gameEventEmitter.emit(EVENT_RECEIVE_CARD, payload)
  }
};