import { PlayerCard, SessionData } from "../types/data.js";
import Card from "./Card.js";
import { EVENT_RECEIVE_CARD, SocketWithExtraData } from "../types/socket-types/general.js";
import { SerializedPlayer } from "../types/data.js";
import { EventReceiveCard } from "../types/events.js";
import { gameEventEmitter } from "../utils/GameEventEmitter.js";
import { createCardKey } from "../utils/helper-function.js";

export default class Player {
  sessionData: SessionData;
  cards: Array<Card>;
  socket: SocketWithExtraData;

  constructor(sessionData: SessionData, socket: SocketWithExtraData) {
    this.sessionData = sessionData;
    this.socket = socket;
    this.cards = [];
  }

  serialize() {
    const serializedCards: Array<PlayerCard> = [];
    for (const card of this.cards) {
      serializedCards.push(card.serialize());
    }
    const serializedPlayer: SerializedPlayer = {
      sessionData: {...this.sessionData},
      cards: serializedCards
    }
    return serializedPlayer;
  }

  getName() : string {
    return this.sessionData.username;
  }

  removeCards(cardsToRemove: Array<Card>) {
    const cardIndexes = {};
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      cardIndexes[createCardKey(card)] = i;
    }
    const indexesToRemove = [];
    for (const card of cardsToRemove) {
      const cardKey = createCardKey(card);
      if (cardIndexes[cardKey] === undefined) {
        continue;
      }
      indexesToRemove.push(cardIndexes[cardKey]);
    }
    indexesToRemove.sort();
    indexesToRemove.reverse();
    for (const indexToRemove of indexesToRemove) {
      this.cards.splice(indexToRemove, 1)
    }
  }

  getSocket(): SocketWithExtraData {
    return this.socket;
  }

  setSocket(socket: SocketWithExtraData) {
    this.socket = socket;
  }

  getSessionData() {
    return this.sessionData;
  }

  getCards() {
    return this.cards;
  }

  getUserID() {
    return this.sessionData?.userID;
  }

  receiveCardsData(cardsData: Array<PlayerCard>) {
    for (const cardData of cardsData) {
      this.cards.push(new Card(cardData.suit, cardData.rank));
    }
  }

  receiveCard(cardData: PlayerCard) {
    const receivedCard = new Card(cardData.suit, cardData.rank)
    this.cards.push(receivedCard);
    const payload: EventReceiveCard = {
      player: this.serialize(),
      card: receivedCard.serialize()
    }
    gameEventEmitter.emit(EVENT_RECEIVE_CARD, payload)
  }
};