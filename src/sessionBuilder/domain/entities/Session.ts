import { randomUUID } from "crypto";

import {
  EmotionalState,
  SessionFiles,
  SessionId,
  SessionSettings,
  SessionStatus,
  SessionDTO,
} from "../../interfaces/Session";
import { CreateSessionInput } from "../../interfaces/SessionInput";

/**
 * @description Represents a session entity with methods to manage its state.
 */
export class Session {
  private sessionId: SessionId;
  private userId: string;
  private emotionalState: EmotionalState;
  private settings: SessionSettings;
  private files: SessionFiles;
  private status: SessionStatus;
  private createdAt: string;
  private updatedAt: string;

  constructor(input?: CreateSessionInput) {
    this.sessionId = "";
    this.userId = "";
    this.emotionalState = { details: "" };
    this.settings = {
      language: "",
      soundscape: "",
      narrator: "",
      duration: "",
      type: "",
    };
    this.files = {
      script: "",
      sound: "",
      narration: "",
    };
    this.status = "CREATED";
    this.createdAt = "";
    this.updatedAt = "";

    if (input) this.make(input);
  }

  /**
   * @description Create a valid, starting-state ("open") invariant of the Session.
   */
  private make(input: CreateSessionInput): SessionDTO {
    const currentTime = this.getCurrentTime();

    this.sessionId = randomUUID().toString();
    this.userId = input.userId;
    this.emotionalState = input.emotionalState;
    this.settings = input.settings;
    this.files = {
      script: "",
      sound: "",
      narration: "",
    };
    this.status = "CREATED";
    this.createdAt = currentTime;
    this.updatedAt = currentTime;

    return this.toDto();
  }

  /**
   * @description Create a session from a data transfer object.
   */
  public fromDto(sessionDto: SessionDTO): Session {
    this.sessionId = sessionDto.sessionId;
    this.userId = sessionDto.userId;
    this.emotionalState = sessionDto.emotionalState;
    this.settings = sessionDto.settings;
    this.files = sessionDto.files;
    this.status = sessionDto.sessionStatus;
    this.createdAt = sessionDto.createdAt;
    this.updatedAt = sessionDto.updatedAt;

    return this;
  }

  /**
   * @description Convert the session entity to a data transfer object.
   */
  public toDto(): SessionDTO {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      emotionalState: this.emotionalState,
      settings: this.settings,
      files: this.files,
      sessionStatus: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private getCurrentTime(): string {
    return new Date().toISOString();
  }

  /**
   * @description Update the session status.
   */
  public updateStatus(newStatus: SessionStatus): void {
    this.status = newStatus;
  }

  /**
   * @description Update the emotional state of the session.
   */
  public updateEmotionalState(newEmotionalState: EmotionalState): void {
    this.emotionalState = newEmotionalState;
  }

  /**
   * @description Update the session settings.
   */
  public updateSettings(newSettings: SessionSettings): void {
    this.settings = newSettings;
  }

  /**
   * @description Update the session files.
   */
  public updateFiles(newFiles: SessionFiles): void {
    this.files = newFiles;
  }
}
