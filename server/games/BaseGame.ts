import { AnswerTypeEnum, GameDTO } from '../DTO/GameDTO.ts';
import { Party } from "../model/Party.ts";
import { PlayerAnswer } from '../model/PlayerAnswer.ts';
import { Player } from "../model/player.ts";
import { getPlayer } from '../services/player.service.ts';
import { AnswerType } from '../DTO/GameDTO.ts';
import { BasicGameStatus } from '../enum/BasicGameStatus.ts';

export abstract class BaseGame<T extends AnswerType> {

    public id = crypto.randomUUID();
    public answers: PlayerAnswer<T>[] = [];
    public basicStatus: BasicGameStatus = BasicGameStatus.STARTED;

    constructor(
        public name: string,
        public answerType: AnswerTypeEnum,
        public party: Party,
        public description?: string
    ) { }

    public addAnswer(player: Player, content: T) {
        player.hasVoted = true;
        const vote = new PlayerAnswer(player, content);
        this.answers.push();
        return vote;
    }

    public reset(): void {
        const players: Player[] = this.answers.map(a => getPlayer(a.playerId)).filter(p => p) as Player[];
        players.forEach(p => p.hasVoted = false);
        this.answers = [];
    }

    public abstract toDTO(): GameDTO;
    protected baseToDTO(): GameDTO {
        return {
            id: this.id,
            name: this.name,
            answerType: this.answerType,
            description: this.description,
            answers: this.answers.map(a => a.toDTO()),
            content: {},
            status: this.basicStatus
        }
    }
}