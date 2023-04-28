import Card from '../models/Card.js';
import Set from '../models/Set.js';
import type Game from '../models/Game.js';
import { TransferCard, Set as SerializedSet } from '../types/general.js';
import type SessionStore from '../utils/SessionStore.js';

export const createPlayersInLobbyPayload = (sessionStore: SessionStore) => {
  const sessions = sessionStore.findAllSessions();
  return sessions.map(session => {
    return {
      connected: session.connected,
      ready: session.ready,
      username: session.player.getName(),
      userID: session.player.sessionData.userID
    }
  });
}

export const sendSocketPayloads = (sendPayloads) => {
  for (const data of sendPayloads) {
    data.socket?.emit(data.event, data.payload);
  }
}

export const buildCardsFromJsonData = (cards: Array<TransferCard>) : Array<Card> => {
  let builtCards = [];
  for (const card of cards) {
    builtCards.push(buildCardFromJsonData(card));
  } 
  return builtCards;
}

export const buildCardFromJsonData = (card: TransferCard) => {
  return new Card(card.suit, card.rank)
}

export const buildSetFromJsonData = (set: SerializedSet, sessionStore: SessionStore) => {
  return new Set(
    sessionStore.findPlayer(set.player.sessionData.sessionID),
    set.rank,
    set.amount,
    buildCardsFromJsonData(set.actualCards)
  );
}

export const generateStartGameSocketPayloads = (
  game: Game, 
  sessionStore: SessionStore, 
  specificSessions : Array<string> | null = null, 
  event = 'startGame'
) => {
  const sessions = sessionStore.findAllSessions()
  const selectedPlayerIndex = game.getSelectedPlayerIndex();
  const generatedSocketPayloads = [];
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const player = session.player;
    const sessionData = player.sessionData;
    if (specificSessions && !specificSessions.includes(sessionData.sessionID)) {
      continue;
    }
    const socket = player.getSocket();
    const playersData = [];
    for (let b = 0; b < sessions.length; b++) {
      const gameSession = sessions[b];
      const gamePlayer = gameSession.player;
      const sendEmptyCards = b !== i;
      const cards = gamePlayer.getCards().map(card => {
        return sendEmptyCards ? {} : card;
      });
      playersData.push({
        cards,
        username: gamePlayer.getName(),
        userID: gamePlayer.sessionData.userID,
        ready: session.ready,
        connected: session.connected,
        gameLoaded: session.gameLoaded,
      });
    }
    const payload = {
      gameData: {
        players: playersData,
        middleData: game.getMiddle().serialize(),
        selectedPlayerIndex,
        playerIndex: i,
        userID: player.sessionData.userID,
        gameOver: game.gameOver,
        playerIndexWhoWon: game.playerIndexWhoWon,
        playingGame: true,
      },
      userData:  {
        username: sessionData.username,
        userID: sessionData.userID,
        sessionID: sessionData.sessionID,
      }
    };
    generatedSocketPayloads.push({
      event,
      sessionID: sessionData.sessionID,
      socket,
      payload
    })
  }
  return generatedSocketPayloads;
}