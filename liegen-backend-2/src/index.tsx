import { SocketWithExtraData, HANDLERS_STATE } from './types/socket-types/general.js';
import { sessionStore } from './utils/SessionStore.js';
import { app, server, io } from './utils/io.js';
import { setHandlers } from './register-socket-handlers/set-handlers.js';
import { CONTINUE_TO_GAME, CONTINUE_TO_LOBBY } from './types/socket-types/enter-username.js';
import { createPlayersDataPayload, setSocketConnected } from './register-socket-handlers/general.js';
import { game } from './models/Game.js';
import { GameStates } from './constants.js';
import { SerializedGame } from './types/data.js';

io.on('connection', (socket: SocketWithExtraData) => {
  const sessionID = socket.handshake.auth?.sessionID ?? null;
  const session = sessionStore.findSession(sessionID);
  if (session && game.getState() !== GameStates.IDLE) {
    socket.data.sessionID = session.sessionID;
    socket.data.userID = session.userID;
    setSocketConnected(io, socket);
    if (!game.renewSocketForLinkedPlayer(socket)) {
      console.error(`Could not attach new socket to player with session ID: ${socket.data.sessionID}`);
      return;
    }
    const payload: SerializedGame = game.serialize(socket);
    socket.emit(CONTINUE_TO_GAME, payload);
    setHandlers(io, socket, HANDLERS_STATE.GAME);
  } else if (session) {
    socket.data.sessionID = session.sessionID;
    socket.data.userID = session.userID;
    setSocketConnected(io, socket);
    const playersLobbyPayload = createPlayersDataPayload();
    socket.emit(CONTINUE_TO_LOBBY, {
      userID: session.userID,
      players: playersLobbyPayload
    });
    setHandlers(io, socket, HANDLERS_STATE.LOBBY);
  } else {
    setHandlers(io, socket, HANDLERS_STATE.ENTER_USERNAME);
  }
});

server.listen(3002, () => {
  console.log('listening on *:3002');
});