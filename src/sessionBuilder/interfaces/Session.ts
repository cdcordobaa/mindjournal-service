export type EmotionalState = {
  details: string;
};

export type SessionSettings = {
  language: string;
  soundscape: string;
  narrator: string;
  duration: string;
  type: string;
};

export type SessionFiles = {
  script: string;
  sound: string;
  narration: string;
};

/**
 * @description Represents the valid and complete data of a
 * correctly shaped Session entity.
 */
export interface SessionDTO {
  /**
   * @description The ID of the user that created this session.
   */
  userId: string;
  /**
   * @description The ID of this session.
   */
  sessionId: string;
  /**
   * @description Status of the session.
   */
  sessionStatus: SessionStatus;
  /**
   * @description Time of creation of the session using ISO format.
   */
  createdAt: string;
  /**
   * @description Time of last update of the session using ISO format.
   */
  updatedAt: string;
  emotionalState: EmotionalState;
  settings: SessionSettings;
  files: SessionFiles;
}

/**
 * @description The ID of a session.
 */
export type SessionId = string;

/**
 * @description Represents the steady states a session can be in.
 */
export type SessionStatus =
  | "CREATED"
  | "SCRIPT_BUILDING"
  | "NARRATION_BUILDING"
  | "SOUNDSCAPE_BUILDING"
  | "ASSEMBLING"
  | "READY_TO_PLAY"
  | "STARTED"
  | "PAUSED"
  | "FINISHED"
  | "FEEDBACK_PROVIDED"
  | "ARCHIVED";
