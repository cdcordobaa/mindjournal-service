import { Repository } from "../../interfaces/Repository";
import { Event } from "../../interfaces/Event";
import { SessionDTO, SessionId } from "../../interfaces/Session";
import { TestData } from "../../interfaces/Data";

/**
 * @description Factory function for local repository.
 */
export function createLocalRepository(testData?: TestData): LocalRepository {
  return new LocalRepository(testData);
}
class LocalRepository implements Repository {
  sessions: SessionDTO[] = [];
  events: Event[] = [];

  constructor(testData?: TestData) {
    this.sessions = testData?.sessions ?? [];
  }

  async loadSession(sessionId: SessionId): Promise<SessionDTO> {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    if (!session) throw new Error("Session not found");
    return session;
  }

  async updateSession(session: SessionDTO): Promise<void> {
    const index = this.sessions.findIndex(
      (s) => s.sessionId === session.sessionId,
    );
    if (index !== -1) {
      this.sessions[index] = session;
    } else {
      this.sessions.push(session);
    }
  }

  async createSession(session: SessionDTO): Promise<void> {
    this.sessions.push(session);
  }

  async addEvent(event: Event): Promise<void> {
    this.events.push(event);
  }
}
