import { AnswerTypeEnum, GameDTO } from "../DTO/GameDTO.ts";
import { Party } from "../model/Party.ts";
import { PlayerAnswer } from "../model/PlayerAnswer.ts";
import { Player } from "../model/player.ts";
import { getPlayer } from "../services/player.service.ts";
import { AnswerType } from "../DTO/GameDTO.ts";
import { BasicGameStatus } from "../enum/BasicGameStatus.ts";

export abstract class BaseGame<T extends AnswerType> {
  public abstract id: number;
  public answers: PlayerAnswer<T>[] = [];
  public basicStatus: BasicGameStatus = BasicGameStatus.STARTED;

  constructor(public name: string, public answerType: AnswerTypeEnum, public party: Party, public changeCallback: () => void, public description?: string) {}

  public addAnswer(player: Player, content: T) {
    if (this.basicStatus !== BasicGameStatus.VOTING) throw new Error("Game is not in voting state");
    player.hasVoted = true;
    if (this.answers.find((a) => a.playerId == player.id)) {
      this.answers = this.answers.filter((a) => a.playerId !== player.id);
    }
    const vote = new PlayerAnswer(player, content);
    this.answers.push(vote);

    if (this.answers.length === this.party.players.length) {
      this.next();
      console.log("next");
    }
    this.changeCallback();
    return vote;
  }

  public reset(): void {
    const players: Player[] = this.answers.map((a) => getPlayer(a.playerId)).filter((p) => p) as Player[];
    players.forEach((p) => (p.hasVoted = false));
    this.answers = [];
  }

  public getAnswer(player: Player): PlayerAnswer<T> | undefined {
    return this.answers.find((a) => a.playerId == player.id);
  }

  public abstract start(): void;
  public abstract stop(): void;
  public abstract next(): void;

  public abstract toDTO(): GameDTO;
  protected baseToDTO(): GameDTO {
    return {
      id: this.id,
      name: this.name,
      answerType: this.answerType,
      description: this.description,
      answers: this.answers.map((a) => a.toDTO()),
      content: {},
      status: this.basicStatus,
    };
  }
}
