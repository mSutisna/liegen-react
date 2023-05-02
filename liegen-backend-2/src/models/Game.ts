import { SerializedGame, SerializedPlayer, SessionData } from "../types/data.js";
import { GameStates } from '../constants.js'
import Player from "./Player.js";
import { SocketWithExtraData } from "../types/socket-types/general.js";
import Deck from "./Deck.js";
import Middle from "./Middle.js";

export default class Game {
  sessions: Array<SessionData>;
  players: Array<Player>;
  state: GameStates;
  deck: Deck;
  middle: Middle;

  selectedPlayerIndex: number;
  playerIndexWhoWon: number | null;
  makeSetInProgress: boolean;
  callBustInProgress: boolean;
  gameOver: boolean;
  resettingToLobby: boolean;

  constructor() {
    this.state = GameStates.IDLE;
    this.players = [];
    this.sessions = [];
    this.deck = new Deck();
    this.middle = new Middle;
    this.selectedPlayerIndex = 0;
    this.playerIndexWhoWon = null;
    this.makeSetInProgress = false;
    this.callBustInProgress = false;
    this.gameOver = false;
    this.resettingToLobby = false;
  }

  getState() : GameStates {
    return this.state;
  }

  getPlayers() : Array<Player> {
    return this.players;
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
    this.players = players;
    this.state = GameStates.STARTED;
  }

  dealCards() {
    this.state = GameStates.PLAYING;
    this.deck.dealCards(this.getPlayers())
  }

  serialize(socket: SocketWithExtraData): SerializedGame {
    const serializedPlayers: Array<SerializedPlayer> = [];
    let playerIndex = null;
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.getUserID() === socket.data.userID) {
        playerIndex = i;
      }
    }
    for (const player of this.players) {
      serializedPlayers.push(player.serialize(player.getUserID() !== socket.data.userID))
    }
    return {
      userID: socket.data.userID,
      players: serializedPlayers,
      middleData: this.middle.serialize(),
      selectedPlayerIndex: this.selectedPlayerIndex,
      playerIndex,
      gameOver: this.gameOver,
      playerIndexWhoWon: this.playerIndexWhoWon,
    }
  }
}

const game = new Game();

export {
  game
}