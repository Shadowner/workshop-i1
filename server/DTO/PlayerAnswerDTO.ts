import { PlayerId } from "./PlayerDTO.ts";

export interface PlayerAnswerDTO<AnswerType> {
    playerId: PlayerId,
    vote: AnswerType
}
