import { GameStates } from '../constants.js';
import { EVENT_MAKE_SET_RESPONSE, EVENT_CALL_BUST, EVENT_CALL_BUST_RESPONSE, EVENT_RESET_TO_LOBBY } from '../constants.js';
import { buildCardsFromJsonData, buildSetFromJsonData } from '../utils/helper-functions.js';
import Player from './Player.js';
import Deck from './Deck.js';
import Card from './Card.js';
import Middle from './Middle.js';
import Set from './Set.js';
import { sessionStore } from '../utils/SessionStore.js';
import { registerAllListeners } from '../socketListeners/main-listeners.js';
import { gameStateCacher } from '../utils/GameStateCacher.js';
import { gameEventEmitter } from '../utils/GameEventEmitter.js';
import { CachedGameState, PlayerDataGame, SocketExtraData } from '../types/general.js';
import { type Socket } from 'socket.io';
import { EventCallBust, EventMakeSet } from '../types/events.js';

export default class Game {
  state: GameStates;
  deck: Deck;
  middle: Middle;
  gameOver: boolean;
  selectedPlayerIndex: number;
  playerIndexWhoWon: number;
  makeSetInProgress: boolean;
  callBustInProgress: boolean;
  resettingToLobby: boolean;

  constructor() {
    const cachedGame = gameStateCacher.getCacheGameStateGame();
    this.state = cachedGame?.state ?? GameStates.IDLE;
    let deckCardsToBuild = cachedGame?.deck ?? [];
    let deckCards: Array<Card> = []
    if (deckCardsToBuild.length > 0) {
      deckCards = buildCardsFromJsonData(deckCardsToBuild);
    }
    let middleCardsToBuild = cachedGame?.middle?.cards ?? [];
    let middleCards: Array<Card> = [];
    if (middleCardsToBuild.length > 0) {
      middleCardsToBuild = buildCardsFromJsonData(middleCardsToBuild);
    }
    let middleSetToBuild = cachedGame?.middle?.set ?? null;
    let middleSet = null;
    if (middleSetToBuild) {
      middleSet = buildSetFromJsonData(middleSetToBuild, sessionStore);
    }

    this.deck = new Deck(deckCards);
    this.middle = new Middle(middleCards, middleSet);
    this.selectedPlayerIndex = cachedGame?.selectedPlayerIndex ?? 0;
    this.gameOver = cachedGame?.gameOver ?? false;
    this.playerIndexWhoWon = cachedGame?.playerIndexWhoWon ?? null;
    this.makeSetInProgress = false;
    this.callBustInProgress = false;
    this.resettingToLobby = false;
  }

  serialize() {
    const sessions = sessionStore.findAllSessions();
    const players = [];
    for (const session of sessions) {
      const playerData = session.player.serialize();
      const finalPlayerData: PlayerDataGame = {
        ...playerData,
        ready: session.ready,
        connected: session.connected,
        gameLoaded: session.gameLoaded
      }
      players.push(finalPlayerData)
    }
    const serializedGame = {
      state: this.state,
      selectedPlayerIndex: this.selectedPlayerIndex,
      deck: this.deck?.serialize() ?? null,
      middle: this.middle?.serialize() ?? null,
      players,
      gameOver: this.gameOver,
      playerIndexWhoWon: this.playerIndexWhoWon
    };
    return serializedGame;
  }

  getSelectedPlayerIndex() {
    return this.selectedPlayerIndex;
  }

  getMiddle() {
    return this.middle;
  }

  changeState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  async setGameLoadedForPlayer(socket: SocketExtraData) {
    const playerSession = sessionStore.findSession(socket.sessionID);
    playerSession.gameLoaded = true;
    sessionStore.saveSession(socket.sessionID, playerSession);
    const sessions = sessionStore.findAllSessions();
    for (const session of sessions) {
      if (!session.gameLoaded) {
        return;
      }
    }
    this.startGame();
  }

  addPlayer(socket: SocketExtraData) {
    if (this.state !== GameStates.IDLE) {
      return {
        error: 'Game is already started'
      }
    }

    if (
      !socket.sessionID
      || !socket.userID
      || !socket.username
    ) {
      return {
        error: 'Invalid config'
      }
    }

    if (sessionStore.findSession(socket.sessionID)) {
      return true;
    }

    const baseSessionData = {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username
    };

    const player = new Player(socket, baseSessionData);
    sessionStore.saveSession(socket.sessionID, {
      ...baseSessionData,
      connected: true,
      ready: false,
      gameLoaded: false,
      player
    });
    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID,
    });
    registerAllListeners(socket, this);
    return true;
  }

  getPlayerByIndex(index: number) {
    return sessionStore.getPlayers()[index] ?? null;
  }

  startGame() {
    this.changeState(GameStates.PLAYING);
    const players = sessionStore.getPlayers();
    for (const player of players) {
      const socket = player.getSocket();
      socket.on('makeSet', ({set}) => {
        this.receiveSet(set);
      });
      socket.on('callBust', ({bust}) => {
        this.callBust(bust);
      })
    }
    this.deck.dealCards(sessionStore.getPlayers());
  }

  receiveSet(setData) {
    const player = game.getPlayerByIndex(setData.playerIndex); 
    const socket = player.getSocket();
    if (this.makeSetInProgress) {
      socket.emit(EVENT_MAKE_SET_RESPONSE, {
        error: 'Somebody else is already making a set, you have to wait till the set of that person is placed.'
      })
      return;
    }
    if (
      setData.cards === null
      || setData.rank === null
      || setData.amount === null
    ) {
      socket.emit(EVENT_MAKE_SET_RESPONSE, {
        error: ''
      })
      return;
    }
    if (setData.playerIndex !== this.selectedPlayerIndex) {
      socket.emit(EVENT_MAKE_SET_RESPONSE, {
        error: 'You can\'t make a set, it\'s not your turn.'
      })
      return;
    }
    const lastSet = this.getMiddle()?.getSet();
    if (lastSet && lastSet.getPlayer().getCards().length === 0) {
      socket.emit(EVENT_MAKE_SET_RESPONSE, {
        error: 'The player of the last set has no cards left. Someone must call bust!'
      })
      return;
    }
    this.makeSetInProgress = true;
    const set = new Set(
      player,
      setData.rank,
      setData.amount,
      buildCardsFromJsonData(setData.cards)
    );
    player.removeCards(set.getActualCards());
    const players = sessionStore.getPlayers();
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
    gameEventEmitter.emit(EVENT_MAKE_SET_RESPONSE, eventMakeSet);
    this.makeSetInProgress = false;
  }

  async callBust(bustData) {
    const playerIndex = bustData.playerIndex;
    const playerToCallBust = game.getPlayerByIndex(playerIndex); 
    const socket = playerToCallBust.getSocket();
    if (this.callBustInProgress) {
      socket.emit(EVENT_CALL_BUST_RESPONSE, {
        error: 'Somebody else calling bust on the last set. You have to wait till the bust of that set is over.'
      })
      return;
    }
    const set = this.getMiddle().getSet();
    if (!set) {
      socket.emit(EVENT_CALL_BUST_RESPONSE, {
        error: 'Can\'t call bust because there is no set to bust.'
      });
      return;
    }
    const setActualCards = set.getActualCards();
    const setPlayer = set.getPlayer();
    if (setPlayer === playerToCallBust) {
      socket.emit(EVENT_CALL_BUST_RESPONSE, {
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
    gameEventEmitter.emit(EVENT_CALL_BUST_RESPONSE, eventCallBust);
    this.callBustInProgress = false;
    if (this.gameOver && !this.resettingToLobby) {
      this.resettingToLobby = true;
      this.resetGame();
      let secondsLeftToReset = 10;
      const interval = setInterval(() => {
        const redirect = secondsLeftToReset === 0;
        for (const player of sessionStore.getPlayers()) {
          const socket = player.getSocket();
          socket.emit(EVENT_RESET_TO_LOBBY, {
            playerWhoWonIndex: playerIndexWhoWon,
            secondsLeftToReset,
            redirect
          })
        }
        secondsLeftToReset--;
        if (redirect) {
          clearInterval(interval);
        }
      }, 1000)
    }
  }

  resetGame() {
    this.deck = new Deck();
    this.middle = new Middle();
    this.selectedPlayerIndex = 0;
    this.gameOver = false;
    this.playerIndexWhoWon = null;
    this.makeSetInProgress = false;
    this.callBustInProgress = false;
    this.resettingToLobby = false;
    this.state = GameStates.IDLE;
    for (const session of sessionStore.findAllSessions()) {
      const socket = session.player.getSocket();
      session.ready = false;
      session.gameLoaded = false;
      session.player.cards = [];
      session.player.hasTurn = false;
      sessionStore.saveSession(socket.sessionID, session);
    }
    gameStateCacher.cacheGame(this, sessionStore.findAllSessions());
  }

  getIndexForPlayer(playerToGetIndexFor) {
    const players = sessionStore.getPlayers();
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.getUserID() === playerToGetIndexFor.getUserID()) {
        return i;
      }
    }
    return null;
  }
};

const game = new Game();

export {
  game
}