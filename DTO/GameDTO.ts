import { PlayerId } from "./PlayerDTO.ts";
import { PlayerAnswerDTO } from './PlayerAnswerDTO.ts';
import { BasicGameStatus } from '../enum/BasicGameStatus.ts';

export interface GameDTO {
    id: string;
    answers: PlayerAnswerDTO<AnswerType>[];
    status: BasicGameStatus;
    answerType: AnswerTypeEnum;
    content: any;
    name: string;
    description?: string;
}

export type AnswerType = string | PlayerId | number
export enum AnswerTypeEnum {
    PlayerId,
    Number,
    String
}