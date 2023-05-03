import { SerializedGame, SerializedPlayer, SessionData } from "../types/data.js";
import { GameStates } from '../constants.js'
import Player from "./Player.js";
import { SocketWithExtraData } from "../types/socket-types/general.js";
import Deck from "./Deck.js";
import Middle from "./Middle.js";
import MiddleSet from './Set.js'; 
import { EVENT_MAKE_SET, MAKE_SET_RESPONSE, MakeSetData } from "../types/socket-types/game.js";
import { buildCardsFromJsonData } from "../utils/helper-function.js";
import { gameEventEmitter } from "../utils/GameEventEmitter.js";
import { EventMakeSet } from "../types/events.js";

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

  receiveSet(setData: MakeSetData) {
    const player = game.getPlayerByIndex(setData.playerIndex); 
    const socket = player.getSocket();
    if (this.makeSetInProgress) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: 'Somebody else is already making a set, you have to wait till the set of that person is placed.'
      })
      return;
    }
    if (
      setData.cards === null
      || setData.rank === null
      || setData.amount === null
    ) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: ''
      })
      return;
    }
    if (setData.playerIndex !== this.selectedPlayerIndex) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: 'You can\'t make a set, it\'s not your turn.'
      })
      return;
    }
    const lastSet = this.middle.getSet();
    if (lastSet && lastSet.getPlayer().getCards().length === 0) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: 'The player of the last set has no cards left. Someone must call bust!'
      })
      return;
    }
    this.makeSetInProgress = true;
    const set = new MiddleSet(
      player,
      setData.rank,
      setData.amount,
      buildCardsFromJsonData(setData.cards)
    );
    player.removeCards(set.getActualCards());
    const players = this.getPlayers();
    let prevPlayerIndex = null;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player === set.getPlayer()) {
        prevPlayerIndex = i;
        break;
      }
    }
    this.middle.setSet(set);
    let selectedPlayerIndex = this.selectedPlayerIndex - 1;
    if (selectedPlayerIndex < 0) {
      selectedPlayerIndex = players.length - 1;
    }
    this.selectedPlayerIndex = selectedPlayerIndex;
    const eventMakeSet: EventMakeSet = {
      prevPlayerIndex,
      currentPlayerIndex: selectedPlayerIndex,
      rank: set.getRank(),
      amount: set.getAmount(),
      cardsData: set.getActualCards()
    }
    gameEventEmitter.emit(EVENT_MAKE_SET, eventMakeSet);
    this.makeSetInProgress = false;
  }

  getPlayerByIndex(index: number) {
    return this.players[index] ?? null;
  }

  renewSocketForLinkedPlayer(socket: SocketWithExtraData): boolean {
    for (const player of this.players) {
      if (socket.data.sessionID === player.sessionData.sessionID) {
        player.setSocket(socket);
        return true;
      }
    }
    return false;
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