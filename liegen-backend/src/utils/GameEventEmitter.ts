import EventEmitter from 'node:events';
import { gameStateCacher } from './GameStateCacher.js';
import { generateStartGameSocketPayloads, sendSocketPayloads } from './helper-functions.js';

import {
  EVENT_START_GAME,
  EVENT_RECEIVE_CARD,
  EVENT_MAKE_SET_RESPONSE,
  EVENT_CALL_BUST_RESPONSE,
} from '../constants.js'

import type Game from '../models/Game.js';
import type SessionStore from './SessionStore.js';
import { EventCallBust, EventMakeSet, EventReceiveCard, EventStartGame } from '../types/events.js';

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

gameEventEmitter.on(EVENT_START_GAME, function(startGameEvent: EventStartGame) {
  const self = this as GameEventEmitter;
  gameStateCacher.cacheGame(self.game, self.sessionStore.findAllSessions());
  const socketPayloads = generateStartGameSocketPayloads(self.game, self.sessionStore, startGameEvent.sessionIDs, startGameEvent.type);
  sendSocketPayloads(socketPayloads);
});

gameEventEmitter.on(EVENT_MAKE_SET_RESPONSE, function (makeSetEvent: EventMakeSet) {
  const self = this as GameEventEmitter;
  gameStateCacher.cacheGame(self.game, self.sessionStore.findAllSessions());
  for (const player of self.sessionStore.getPlayers()) {
    const socket = player.getSocket();
    socket.emit(EVENT_MAKE_SET_RESPONSE, makeSetEvent);
  }
})

gameEventEmitter.on(EVENT_CALL_BUST_RESPONSE, function (callBustEvent: EventCallBust) {
  const self = this as GameEventEmitter;
  gameStateCacher.cacheGame(self.game, self.sessionStore.findAllSessions());
  const playerToGiveCardsTo = self.game.getPlayerByIndex(callBustEvent.playerToGiveCardsToIndex);
  for (const player of self.sessionStore.getPlayers()) {
    const socket = player.getSocket();
    let middleCards = callBustEvent.cards;
    if (playerToGiveCardsTo.getUserID() !== player.getUserID()) {
      const newMiddleCards = [];
      for (const card of middleCards) {
        newMiddleCards.push({});
      }
      middleCards = newMiddleCards;
    }
    socket.emit(EVENT_CALL_BUST_RESPONSE, callBustEvent);
  }
})

gameEventEmitter.on(EVENT_RECEIVE_CARD, function (receiveCardEvent: EventReceiveCard) {
  const self = this as GameEventEmitter;
  const player = receiveCardEvent.player;
  const card = receiveCardEvent.card;
  const realPlayer = self.sessionStore.findPlayer(player.sessionData.sessionID);
  const session = self.sessionStore.findSession(player.sessionData.sessionID);
  session.player = realPlayer;
  this.sessionStore.saveSession(player.sessionData.sessionID, session);
  gameStateCacher.cacheGame(self.game, self.sessionStore.findAllSessions());
  const players = self.sessionStore.getPlayers();
  for (let i = 0; i < players.length; i++) {
    const gamePlayer = players[i];
    const socket = realPlayer.getSocket();
    const cardData = player.sessionData.userID === gamePlayer.getUserID() ? card : {rank: null, suit: null};
    const payload = {
      cardData,
      playerIndex: i
    }
    socket.emit(EVENT_RECEIVE_CARD, payload);
  }
});

export { gameEventEmitter };