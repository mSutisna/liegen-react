import { type Server } from "socket.io"
import type Card from "../models/Card.js"
import { SocketWithExtraData } from "../types/socket-types/general.js"

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