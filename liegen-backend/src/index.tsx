import {app, server, io} from './utils/io.js';
import { MAX_AMOUNT_OF_PLAYERS } from './constants.js';
import { DotEnv, SocketExtraData } from './types/general.js';
import { v4 as uuidv4 } from 'uuid';
import { sessionStore } from './utils/SessionStore.js'
import { createPlayersInLobbyPayload } from './utils/helper-functions.js';
import { registerAllListeners } from './socketListeners/main-listeners.js';
import { game } from './models/Game.js';
import { gameEventEmitter } from './utils/GameEventEmitter.js';
gameEventEmitter.setGame(game);
gameEventEmitter.setSessionStore(sessionStore);
import { GameStates, StartGameTypes } from './constants.js';
import { EVENT_START_GAME } from './constants.js';
import { EventStartGame } from './types/events.js';


io.on('connection', (socket: SocketExtraData) => {
  const sessionID = socket.handshake.auth?.sessionID ?? null;
  const session = sessionStore.findSession(sessionID);
  if (!session) {
    registerListeners(socket);
    return;
  }
  let connectedSessionsCount = 0;
  for (const session of sessionStore.findAllSessions()) {
    if (session.connected) {
      connectedSessionsCount++;
    }
  }
  if (game.getState() === GameStates.IDLE && connectedSessionsCount >= MAX_AMOUNT_OF_PLAYERS) {
    socket.emit('registerCallback', {
      error: 'You can\'t join the lobby because the lobby already contains the maximum amount of players.',
      removeSessionId: true,
    });
    sessionStore.deleteSession(sessionID);
    return;
  }
  const sessionData = session.player.getSessionData();
  session.player.setSocket(socket);
  socket.sessionID = sessionData.sessionID;
  socket.userID = sessionData.userID;
  socket.username = sessionData.username;
  session.connected = true;
  sessionStore.saveSession(socket.sessionID, session);
  socket.on('enterUsernameLoaded', () => {
    if (game.getState() === GameStates.PLAYING) {
      const startGameEvent: EventStartGame = {
        sessionIDs: [socket.sessionID],
        type: StartGameTypes.CONTINUE_GAME
      }
      gameEventEmitter.emit(EVENT_START_GAME, startGameEvent);
      const playersPayload = createPlayersInLobbyPayload(sessionStore);
      io.emit('playersUpdate', {
        players: playersPayload
      })
    }
  });
  registerAllListeners(socket, game);
  if (game.getState() === GameStates.IDLE) {
    sendPlayerChanges(socket);
    return;
  }
});

const registerListeners = (socket: SocketExtraData) => {
  socket.on('register', ({username}) => {
    let sessions = sessionStore.findAllSessions();
    for (const session of sessions) {
      if (session.player.getName() === username) {
        socket.emit('registerCallback', {
          error: 'The username has already been taken',
        })
        return;
      }
    }
    let connectedSessionsCount = 0;
    for (const session of sessions) {
      if (session.connected) {
        connectedSessionsCount++;
      }
    }
    if (connectedSessionsCount >= MAX_AMOUNT_OF_PLAYERS) {
      socket.emit('registerCallback', {
        error: 'The maximum amount of players are already in the lobby',
      })
      return;
    }
    socket.username = username;
    socket.sessionID = uuidv4();
    socket.userID = uuidv4();
    const result = game.addPlayer(socket);
    if (result !== true) {
      socket.emit('registerCallback', {
        error: result.error,
      })
      return;
    }
    sendPlayerChanges(socket);
  })
}

const sendPlayerChanges = (socket: SocketExtraData) => {
  const playersPayload = createPlayersInLobbyPayload(sessionStore);
  io.emit('playersChange', {
    players: playersPayload
  })
  io.emit('playersUpdate', {
    players: playersPayload
  })


  const payload = {
    code: 'continue',
    userData: {
      username: socket.username,
      userID: socket.userID,
      sessionID: socket.sessionID,
    },
    gameData: {
      players: playersPayload,
    }
  };

  console.log('payload', payload)

  socket.emit('registerCallback', payload);
}

server.listen(3002, () => {
  console.log('listening on *:3002');
});