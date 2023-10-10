import json from './undercoverdb.json' with { type: "json" };
import { GameCard } from '../GamerCard.ts';

export class UndercoverDb {

    public static harceledCards = json.filter((card: any) => card.isHarceled).map((card: any) => new GameCard(card.isHarceled, card.content));
    public static normalCards = json.filter((card: any) => !card.isHarceled).map((card: any) => new GameCard(card.isHarceled, card.content));

    public static getRandomHarceledCard(): GameCard {
        const card = this.harceledCards[Math.floor(Math.random() * this.harceledCards.length)];
        return new GameCard(card.isHarceled, card.content);
    }

    public static getRandomNormalCard(): GameCard {
        const card = this.normalCards[Math.floor(Math.random() * this.normalCards.length)];
        return new GameCard(card.isHarceled, card.content);
    }

}