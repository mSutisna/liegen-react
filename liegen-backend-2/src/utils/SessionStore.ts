import { SessionData } from "../types/data.js";

export default class SessionStore {
  sessions: Map<string, SessionData>;
  constructor() {
    this.sessions = new Map()
  }

  findSession(id: string) : SessionData | undefined {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: SessionData) : void {
    this.sessions.set(id, session);
  }

  deleteSession(id: string) : void {
    this.sessions.delete(id);
  }

  getSessions() : Map<string, SessionData> {
    return this.sessions;
  }

  findAllSessions() : Array<SessionData> {
    return [...this.sessions.values()];
  }
}

const sessionStore = new SessionStore();

export {
  sessionStore
}