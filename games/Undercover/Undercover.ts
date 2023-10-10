import { AnswerTypeEnum } from "../../DTO/GameDTO.ts";
import { PlayerId } from "../../DTO/PlayerDTO.ts";
import { io } from "../../main.ts";
import { Party } from "../../model/Party.ts";
import { BaseGame } from "../BaseGame.ts";
import { GameCard } from "./GamerCard.ts";
import { UndercoverDb } from "./db/index.ts";

export class UnderCover extends BaseGame<PlayerId> {

    public numberOfRound = 3;
    public playersRole: Map<PlayerId, GameCard> = new Map();

    constructor(party: Party) {
        super("Undercover", AnswerTypeEnum.PlayerId, party);
    }

    public start() {
        this.distributeRoles();
    }

    public distributeRoles(): void {
        const players = this.party.players;
        const harceledPlayer = players[Math.floor(Math.random() * players.length)];
        const harceledCard = UndercoverDb.getRandomHarceledCard();
        this.playersRole.set(harceledPlayer.id, harceledCard);

        players.filter(p => p.id !== harceledPlayer.id).forEach(p => {
            const notDisturbedCard = UndercoverDb.normalCards.filter(c => !Object.values(this.playersRole).includes(c));
            if (notDisturbedCard.length === 0) {
                //TODO: find a way to handle this case better
                this.playersRole.set(p.id, UndercoverDb.getRandomNormalCard());
                return;
            }
            const normalCard = notDisturbedCard[Math.floor(Math.random() * notDisturbedCard.length)];
            this.playersRole.set(p.id, normalCard);
        });
    }

    public reset(): void {
        super.reset();
        this.playersRole.clear();
        //TODO: le broadcast 
    }

    public toDTO() {
        return {
            ...super.baseToDTO(),
            content: {
                playersRole: this.playersRole,
            }
        }
    }
}