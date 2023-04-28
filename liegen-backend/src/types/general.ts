import { CardRanks, GameStates } from "../constants.js";

import type PlayerInGame from "../models/Player.js";

import { type Socket } from 'socket.io';

export interface DotEnv {
  ORIGIN?: string,
}

export interface TransferCard {
  rank: string,
  suit: string,
}

export interface Card extends TransferCard {
  selected: boolean
}

export interface Player {
  name: string,
  sessionData: SessionData,
  hasTurn: boolean,
  cards?: Array<Card>,
}

export interface PlayerDataGame extends Player {
  ready: boolean,
  connected: boolean,
  gameLoaded: boolean
}

export interface SessionData {
  sessionID: string,
  userID: string,
  username: string,
  connected?: boolean,
  ready?: boolean,
  gameLoaded?: boolean,
  player?: PlayerInGame
}

export interface Set {
  player: Player;
  rank: CardRanks;
  amount: number;
  actualCards: Array<Card>;
}

export interface Middle {
  cards: Array<TransferCard>,
  set: Set
}

export interface Game {
  state: GameStates,
  selectedPlayerIndex: number,
  deck: Array<TransferCard>
  middle: Middle,
  players: Array<PlayerDataGame>,
  gameOver: boolean,
  playerIndexWhoWon: number,
}

export interface CachedGameState {
  game: Game,
  sessions: Array<SessionData>
}

export interface SocketExtraData extends Socket {
  sessionID?: string,
  userID?: string,
  username?: string
}
