import { PlayerAnswerDTO } from "../DTO/PlayerAnswerDTO.ts";
import { Player } from './player.ts';

export class PlayerAnswer<AnswerType> implements PlayerAnswerDTO<AnswerType> {

    public get playerId() {
        return this.player.id;
    }

    constructor(
        public player: Player,
        public vote: AnswerType
    ) { }

    public toDTO(): PlayerAnswerDTO<AnswerType> {
        return {
            playerId: this.playerId,
            vote: this.vote
        }
    }
}