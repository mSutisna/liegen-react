import { CachedGameState, SessionData } from "../types/general.js";

import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import type Game from "../models/Game.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAME_STATE_FILE_PATH = '../../cache/game_state.json'

export default class GameStateCacher {
  writingToCache: boolean;
  filePath: string;
  queue: Array<string>;

  constructor() {
    this.queue = [];
    this.filePath = join(__dirname, GAME_STATE_FILE_PATH);
    this.writingToCache = false;
    this.runQueue();
  }

  getCacheGameStateGame() {
    return this.getCachedGameState().game ?? null;
  }

  getCachedGameStateSessions() {
    return this.getCachedGameState().sessions ?? null;
  }

  getCachedGameState() : CachedGameState | null {
    let gameStateJson: string | CachedGameState = fs.readFileSync(this.filePath, 'utf-8');
    let gameState: CachedGameState | null = gameStateJson.length > 0
      ? JSON.parse(gameStateJson) as CachedGameState
      : null;
    return gameState;
  }

  cacheGame(game: Game, sessions: Array<SessionData>) {
    const sessionsSaveData = [];
    for (const session of sessions) {
      const player = session.player;
      sessionsSaveData.push({
        connected: session.connected,
        ready: session.connected,
        gameLoaded: session.gameLoaded,
        player: player.serialize()
      });
    }
    const cachedGameState = {
      game: game.serialize(),
      sessions: sessionsSaveData
    };
    this.queue.push(JSON.stringify(cachedGameState, null, 2));
  }

  runQueue() {
    if (!this.writingToCache) {
      this.writeToCacheInternal();
    }
    setTimeout(() => this.runQueue(), 100);
  }

  writeToCacheInternal() {
    this.writingToCache = true;
    const json = this.queue.shift();
    if (json) {
      fs.writeFileSync(GAME_STATE_FILE_PATH, json);
    }
    this.writingToCache = false;
  }
}

export const gameStateCacher = new GameStateCacher();