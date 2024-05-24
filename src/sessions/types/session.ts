export type SessionInput = {
  id: string;
  userId: string;
  emotionalState: {
    description: string;
  };
  settings: {
    duration: string;
    narrator: string;
    soundScape: string;
    language: string;
    style: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
