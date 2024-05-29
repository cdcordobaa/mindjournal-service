import { Event } from './Event';
import { SlotDTO, SlotId } from './Slot';
import { SessionDTO, SessionId } from "./Session";

/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  addEvent(event: Event): Promise<void>;
  /**
   * @description Load a session from the source database.
   */
  loadSession(sessionId: SessionId): Promise<SessionDTO>;
  /**
   * @description Create or update a session in the source database.
   */
  updateSession(session: SessionDTO): Promise<void>;
  /**
   * @description Create a new session in the source database.
   */
  createSession(session: SessionDTO): Promise<void>;
}
