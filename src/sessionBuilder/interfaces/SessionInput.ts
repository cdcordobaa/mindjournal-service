export interface CreateSessionInput {
  userId: string;
  emotionalState: { details: string };
  settings: {
    language: string;
    soundscape: string;
    narrator: string;
    duration: string;
    type: string;
  };
}
