export interface PlayerDTO {
    id: PlayerId;
    name?: string;
    hasVoted: boolean;
}

export type PlayerId = string; // UUID
