export interface PlayerDTO {
  id: PlayerId;
  name?: string;
  hasVoted: boolean;
  isReady: boolean;
}

export type PlayerId = string; // UUID
