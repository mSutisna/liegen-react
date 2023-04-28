import { createPlayersInLobbyPayload } from '../utils/helper-functions.js';
import { io } from '../utils/io.js';
import { sessionStore } from '../utils/SessionStore.js';
import { GameStates, StartGameTypes, EVENT_START_GAME } from '../constants.js';
import { EventCallBust, EventMakeSet, EventStartGame } from '../types/events.js';
import { gameEventEmitter } from '../utils/GameEventEmitter.js';
import { SocketExtraData } from '../types/general.js';
import type Game from '../models/Game.js';

const disconnectListener = (reason: any, socket: SocketExtraData) => {
  const session = sessionStore.findSession(socket.sessionID);
  session.connected = false;
  sessionStore.saveSession(socket.sessionID, session);
  const playersPayload = createPlayersInLobbyPayload(sessionStore);
  io.emit('playersChange', {
    players: playersPayload
  })
  io.emit('playersUpdate', {
    players: playersPayload
  })
}

const readyListener = (socket: SocketExtraData) => {
  const session = sessionStore.findSession(socket.sessionID);
  session.ready = !session.ready;
  sessionStore.saveSession(socket.sessionID, session);
  const playersPayload = createPlayersInLobbyPayload(sessionStore);
  io.emit('playersChange', {
    players: playersPayload
  })
  io.emit('playersUpdate', {
    players: playersPayload
  })
}

const startListener = (socket: SocketExtraData, game: Game) => {
  const sessions = sessionStore.findAllSessions();
  const conncetedSessions = sessions.filter(session => session.connected);
  if (conncetedSessions.length < 2) {
    socket.emit('startGame', {
      error: 'At least 2 players should be connected',
    })
    return;
  }
  for (const session of sessions) {
    if (!session.ready) {
      socket.emit('startGame', {
        error: 'Not all players are ready',
      })
      return;
    }
  }
  for (const session of sessions) {
    if (!session.connected) {
      sessionStore.deleteSession(session.sessionID)
    }
  }
  const startGameEvent: EventStartGame = {
    type: StartGameTypes.START_GAME
  }
  gameEventEmitter.emit(EVENT_START_GAME, startGameEvent);
}

const gameLoadedListener = (socket: SocketExtraData, game: Game) => {
  game.setGameLoadedForPlayer(socket);
}

const makeSet = (game: Game, setData: EventMakeSet) => {
  game.receiveSet(setData);
}

const callBust = (game: Game, bustData: EventCallBust) => {
  game.callBust(bustData);
}

const registerAllListeners = (socket: SocketExtraData, game: Game) => {
  socket.on('disconnect', reason => {
    disconnectListener(reason, socket);
  });

  if (game.getState() === GameStates.IDLE) {
    socket.on('ready', () => {
      readyListener(socket);
    })
    socket.on('start', () => {
      startListener(socket, game)
    })
    socket.on('gameLoaded', () => {
      gameLoadedListener(socket, game)
    });
  } else if (game.getState() === GameStates.PLAYING) {
    socket.on('makeSet', ({set}) => {
      makeSet(game, set);
    });
    socket.on('callBust', ({bust}) => {
      callBust(game, bust);
    })
    socket.on('gameOver', ({gameOver}) => {
      gameOver(game, gameOver);
    })
  }
}

export {
  registerAllListeners,
  disconnectListener,
  readyListener,
  startListener
};