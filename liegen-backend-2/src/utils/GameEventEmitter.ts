import EventEmitter from 'node:events';

import {
  EVENT_RECEIVE_CARD,
} from '../types/socket-types/general.js'

import type Game from '../models/Game.js';
import type SessionStore from './SessionStore.js';
import { EventReceiveCard } from '../types/events.js';

class GameEventEmitter extends EventEmitter {
  game: Game;
  sessionStore: SessionStore;

  setGame(game: Game) {
    this.game = game;
  }

  setSessionStore(sessionStore: SessionStore) {
    this.sessionStore = sessionStore;
  }
}

const gameEventEmitter = new GameEventEmitter();

gameEventEmitter.on(EVENT_RECEIVE_CARD, function (receiveCardEvent: EventReceiveCard) {
  const self = this as GameEventEmitter;
  const player = receiveCardEvent.player;
  const card = receiveCardEvent.card;
  const players = self.game.getPlayers();
  const playerIndex = players.findIndex(player => player.sessionData.userID === receiveCardEvent.player.sessionData.sessionID);
  for (let i = 0; i < players.length; i++) {
    const gamePlayer = players[i];
    const socket = gamePlayer.getSocket();
    const cardData = player.sessionData.userID === gamePlayer.getUserID() 
      ? card 
      : {rank: null, suit: null};
    const payload = {
      cardData,
      playerIndex
    }
    socket.emit(EVENT_RECEIVE_CARD, payload);
  }
});

export { gameEventEmitter };