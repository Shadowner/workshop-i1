import { AnswerTypeEnum } from "../../DTO/GameDTO.ts";
import { Party } from "../../model/Party.ts";
import { BaseGame } from "../BaseGame.ts";

export class QuizzGame extends BaseGame<string> {

    public numberOfRound = 3;

    constructor(party: Party) {
        super("Quizz", AnswerTypeEnum.String, party);
    }

    public getQuestion(): string {
        return "What is the capital of France ?";
    }

    public getAnswer(): string {
        return "Paris";
    }

    public toDTO() {
        return {
            ...super.baseToDTO(),
        }
    }
}