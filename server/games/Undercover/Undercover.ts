import { AnswerTypeEnum, GameDTO } from "../../DTO/GameDTO.ts";
import { PlayerId } from "../../DTO/PlayerDTO.ts";
import { BasicGameStatus } from "../../enum/BasicGameStatus.ts";
import { io } from "../../main.ts";
import { Party } from "../../model/Party.ts";
import { BaseGame } from "../BaseGame.ts";
import { UndercoverGameDTO } from "./DTO/UndercoverGameDTO.ts";
import { UnderCoverStatusEnum } from "./DTO/UndercoverStatus.ts";
import { GameCard } from "./GamerCard.ts";
import { UndercoverDb } from "./db/index.ts";

export class UnderCover extends BaseGame<PlayerId> {
  public id = 1;
  public numberOfRound = 3;
  public playersRole: Map<PlayerId, GameCard> = new Map();
  public underCoverStatus: UnderCoverStatusEnum = UnderCoverStatusEnum.IN_GAME;

  constructor(party: Party, changeCallback: () => void) {
    super("Undercover", AnswerTypeEnum.PlayerId, party, changeCallback, "Un des joueurs se verra présenter une situation ou il a été témoin d'harcélement. les autres doivent le trouver");
  }

  public start() {
    this.distributeRoles();
    this.underCoverStatus = UnderCoverStatusEnum.VOTE;
    this.basicStatus = BasicGameStatus.STARTED;
    this.changeCallback();
    setTimeout(() => {
      this.basicStatus = BasicGameStatus.VOTING;
      this.underCoverStatus = UnderCoverStatusEnum.VOTE;
      this.changeCallback();
    }, 3000);
  }

  public stop(): void {
    this.playersRole.clear();
  }

  public next(): void {
    if (this.basicStatus === BasicGameStatus.VOTING && this.underCoverStatus === UnderCoverStatusEnum.VOTE) {
      this.underCoverStatus = UnderCoverStatusEnum.REVEAL;
      setTimeout(() => {
        this.next();
        //TODO: change the time
      }, 15000);
    } else if (this.basicStatus === BasicGameStatus.VOTING && this.underCoverStatus === UnderCoverStatusEnum.REVEAL) {
      this.underCoverStatus = UnderCoverStatusEnum.STATS;
      setTimeout(() => {
        this.next();
        //TODO: change the time
      }, 30000);
    } else if (this.basicStatus === BasicGameStatus.VOTING && this.underCoverStatus === UnderCoverStatusEnum.STATS) {
      this.underCoverStatus = UnderCoverStatusEnum.END;
      this.basicStatus = BasicGameStatus.ENDED;
    }
    this.changeCallback();
  }

  public distributeRoles(): void {
    const players = this.party.players;
    const harceledPlayer = players[Math.floor(Math.random() * players.length)];
    const harceledCard = UndercoverDb.getRandomHarceledCard();
    this.playersRole.set(harceledPlayer.id, harceledCard);

    players
      .filter((p) => p.id !== harceledPlayer.id)
      .forEach((p) => {
        const notDisturbedCard = UndercoverDb.normalCards.filter((c) => !Object.values(this.playersRole).includes(c));
        if (notDisturbedCard.length === 0) {
          //TODO: find a way to handle this case better
          this.playersRole.set(p.id, UndercoverDb.getRandomNormalCard());
          return;
        }
        const normalCard = notDisturbedCard[Math.floor(Math.random() * notDisturbedCard.length)];
        this.playersRole.set(p.id, normalCard);
      });

    console.log(this.playersRole);
  }

  public reset(): void {
    super.reset();
    this.playersRole.clear();
    //TODO: le broadcast
  }

  private convertMapToDTO(map: Map<PlayerId, GameCard>) {
    const result: Record<string, GameCard> = {};
    map.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  public toDTO(): UndercoverGameDTO {
    return {
      ...super.baseToDTO(),
      content: {
        playersRole: this.convertMapToDTO(this.playersRole),
        underCoverStatus: this.underCoverStatus,
      },
    };
  }
}
