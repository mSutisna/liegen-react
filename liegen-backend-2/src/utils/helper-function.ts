import { type Server } from "socket.io"
import Card from "../models/Card.js"
import { SocketWithExtraData } from "../types/socket-types/general.js"
import { BaseCard } from "../types/data.js"

export const createCardKey = (card: Card) => {
  return `${card.getSuit()}-${card.getRank()}`
}

export const createIndexedSocketCollection = (io: Server): {[k: string]: SocketWithExtraData} => {
  const allSockets: Array<SocketWithExtraData> = [...io.sockets.sockets.values()];
  const indexedSocketCollection: {[k: string]: SocketWithExtraData} = {};
  for (const socket of allSockets) {
    indexedSocketCollection[socket.data.sessionID] = socket;
  }
  return indexedSocketCollection
}

export const arrayFlip = (trans) => {
  var key, tmp_ar = {};

  for (key in trans) {
    if (!trans.hasOwnProperty(key)) {continue;}
    tmp_ar[trans[key]] = key;
  }

  return tmp_ar;
}

export const buildCardsFromJsonData = (cards: Array<BaseCard>) : Array<Card> => {
  let builtCards = [];
  for (const card of cards) {
    builtCards.push(buildCardFromJsonData(card));
  } 
  return builtCards;
}

export const buildCardFromJsonData = (card: BaseCard) => {
  return new Card(card.suit, card.rank)
}
