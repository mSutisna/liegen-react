import { SerializedGame, SerializedPlayer, SessionData } from "../types/data.js";
import { GameStates, RANKS } from '../constants.js'
import Player from "./Player.js";
import { SocketWithExtraData } from "../types/socket-types/general.js";
import Deck from "./Deck.js";
import Middle from "./Middle.js";
import MiddleSet from './Set.js'; 
import { CALL_BUST_RESPONSE, CallBustData, EVENT_CALL_BUST, EVENT_MAKE_SET, MAKE_SET_RESPONSE, MakeSetData } from "../types/socket-types/game.js";
import { buildCardsFromJsonData } from "../utils/helper-function.js";
import { gameEventEmitter } from "../utils/GameEventEmitter.js";
import { EventCallBust, EventMakeSet } from "../types/events.js";
import { RANKS_INDEXES } from "../constants.js";

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
        error: 'Unknown error'
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

    if (setData.playerIndex !== this.selectedPlayerIndex) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: 'You can\'t make a set, it\'s not your turn.'
      })
      return;
    }

    if (setData.cards.length === 0) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: 'You must select at least one card to make a set.'
      })
      return;
    }

    if (setData.cards.length > 4) {
      socket.emit(MAKE_SET_RESPONSE, {
        error: 'You can\'t select more than 4 cards for a set.'
      })
      return;
    }

    if (lastSet) {
      const rankIndex = parseInt(RANKS_INDEXES[lastSet.rank]);
      const belowRank = (rankIndex - 1) >= 0 
        ? rankIndex - 1
        : RANKS.length - 1;
      const aboveRank = (rankIndex + 1) <= (RANKS.length - 1)
        ? rankIndex + 1
        : 0;

      const validRankIndexes = [
        belowRank,
        rankIndex,
        aboveRank
      ];

      const rankLabels = validRankIndexes.map(index => {
        return RANKS[index];
      })

      const selectedRankIndex = RANKS_INDEXES[setData.rank];

      if (!validRankIndexes.includes(parseInt(selectedRankIndex))) {
        socket.emit(MAKE_SET_RESPONSE, {
          error: `You can only select one of the following ranks '${rankLabels.join(', ')}' because the rank of the current set is '${RANKS[rankIndex]}'.`
        })
        return;
      }
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


  async callBust(data: CallBustData) {
    const playerIndex = data.playerIndex;
    const playerToCallBust = game.getPlayerByIndex(playerIndex); 
    const socket = playerToCallBust.getSocket();
    if (this.callBustInProgress) {
      socket.emit(CALL_BUST_RESPONSE, {
        error: 'Somebody else calling bust on the last set. You have to wait till the bust of that set is over.'
      })
      return;
    }
    const set = this.middle.getSet();
    if (!set) {
      socket.emit(CALL_BUST_RESPONSE, {
        error: 'Can\'t call bust because there is no set to bust.'
      });
      return;
    }
    const setActualCards = set.getActualCards();
    const setPlayer = set.getPlayer();
    if (setPlayer === playerToCallBust) {
      socket.emit(CALL_BUST_RESPONSE, {
        error: 'You can\'t call bust on your own set.'
      });
      return;
    }
    this.callBustInProgress = true;
    const {
      playerToGiveCardsTo,
      playerToSwitchTo
    } = set.bust(playerToCallBust);

    this.middle.convertLastSetToCards();
    const cards = this.middle.getCards();
    this.middle.reset();
    playerToGiveCardsTo.receiveCardsData(cards);
    let gameOver = false;
    let playerIndexWhoWon = null;
    if (setPlayer.getCards().length === 0) {
      gameOver = true;
      playerIndexWhoWon = this.getIndexForPlayer(setPlayer);
    }
    this.gameOver = gameOver;
    this.playerIndexWhoWon = playerIndexWhoWon;
    this.selectedPlayerIndex = this.getIndexForPlayer(playerToSwitchTo)
    const eventCallBust: EventCallBust = {
      playerToCallBustIndex: playerIndex,
      setPlayerIndex: this.getIndexForPlayer(setPlayer),
      playerToGiveCardsToIndex: this.getIndexForPlayer(playerToGiveCardsTo),
      playerToSwitchToIndex: this.getIndexForPlayer(playerToSwitchTo),
      cards,
      setActualCards,
      gameOver
    }
    gameEventEmitter.emit(EVENT_CALL_BUST, eventCallBust);
    this.callBustInProgress = false;
    // if (this.gameOver && !this.resettingToLobby) {
    //   this.resettingToLobby = true;
    //   this.resetGame();
    //   let secondsLeftToReset = 10;
    //   const interval = setInterval(() => {
    //     const redirect = secondsLeftToReset === 0;
    //     for (const player of sessionStore.getPlayers()) {
    //       const socket = player.getSocket();
    //       socket.emit(EVENT_RESET_TO_LOBBY, {
    //         playerWhoWonIndex: playerIndexWhoWon,
    //         secondsLeftToReset,
    //         redirect
    //       })
    //     }
    //     secondsLeftToReset--;
    //     if (redirect) {
    //       clearInterval(interval);
    //     }
    //   }, 1000)
    // }
  }

  getPlayerByIndex(index: number) {
    return this.players[index] ?? null;
  }

  getIndexForPlayer(playerToGetIndexFor: Player) {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.getUserID() === playerToGetIndexFor.getUserID()) {
        return i;
      }
    }
    return null;
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