import { SessionData } from "../types/data.js";
import { GameStates } from '../constants.js'
import Player from "./Player.js";
import { SocketWithExtraData } from "../types/socket-types/general.js";

export default class Game {
  sessions: Array<SessionData>;
  players: Array<Player>
  state: GameStates;

  constructor() {
    this.state = GameStates.IDLE;
  }

  startGame(sessions: Array<SessionData>, indexedSocketCollection: {[k: string]: SocketWithExtraData}) {
    if (this.state !== GameStates.IDLE) {
      return;
    }
    this.sessions = sessions;
    const players = [];
    for (const session of sessions) {
      const socket = indexedSocketCollection[session.sessionID];
      if (!socket) {
        continue;
      }
      players.push(new Player(session, socket))
    }
    this.state = GameStates.PLAYING;
  }

  getPlayers() : Array<Player> {
    return this.players;
  }
}

const game = new Game();

export {
  game
}