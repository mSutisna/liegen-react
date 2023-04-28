import { gameStateCacher } from '../utils/GameStateCacher.js';
import { buildCardsFromJsonData } from '../utils/helper-functions.js';
import Player from '../models/Player.js';
import { SessionData } from '../types/general.js';

class SessionStore {
  findSession(id: string) {}
  saveSession(id: string, session: SessionData) {}
  findAllSessions() {}
}

export default class InMemorySessionStore extends SessionStore {
  sessions: Map<string, SessionData>;
  constructor() {
    super();
    const sessions = gameStateCacher.getCachedGameStateSessions();
    this.sessions = sessions ? this.buildSessionsMap(sessions) : new Map();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  buildSessionsMap(sessions: Array<SessionData>) {
    const sessionsMap = new Map();
    for (const session of sessions) {
      const sessionID = session.player.sessionData.sessionID;
      session.player = new Player(null, session.player.sessionData, buildCardsFromJsonData(session.player.cards));
      sessionsMap.set(sessionID, session);
    }
    return sessionsMap;
  }

  saveSession(id: string, session: SessionData) {
    this.sessions.set(id, session);
  }

  deleteSession(id: string) {
    this.sessions.delete(id);
  }

  getSessions() {
    return this.sessions;
  }

  findAllSessions() : Array<SessionData> {
    return [...this.sessions.values()];
  }

  findPlayer(id: string) : Player {
    const sessionData = this.findSession(id);
    return sessionData.player;
  }

  getPlayers() : Array<Player> {
    return [...this.findAllSessions()].map(sessionData => sessionData.player)
  }
}

const sessionStore = new InMemorySessionStore();

export {
  sessionStore
}