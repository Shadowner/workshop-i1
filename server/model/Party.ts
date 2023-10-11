import { Player } from "./player.ts";
import { PartyStatus } from '../enum/PartyStatus.ts';
import { BaseGame } from '../games/BaseGame.ts';
import { getRandomGame } from '../services/game.service.ts';
import { PartyDTO } from '../DTO/PartyDTO.ts';

export class Party {

    public id = crypto.randomUUID();
    public players: Player[] = [];

    public status: PartyStatus = PartyStatus.LOBBY;
    public currentGame?: BaseGame<any>;
    public roomCode: string;

    constructor(
        public name: string,
        public maxPlayers: number,
        public presentateur?: Player
    ) {
        this.roomCode = crypto.randomUUID().slice(0, 5);
        if (presentateur) presentateur.currentParty = this;
    }

    public addPlayer(player: Player) {
        this.players.push(player);
        player.currentParty = this;
    }

    public removePlayer(player: Player) {
        player.currentParty = undefined;
        this.players = this.players.filter(p => p.id !== player.id);
    }

    public startGame() {
        this.status = PartyStatus.DISCOVERING;
        this.currentGame = getRandomGame();
    }

    public resetGame() {
        this.status = PartyStatus.LOBBY;
        this.currentGame = undefined;
    }

    public endParty() {
        this.players.forEach(p => p.currentParty = undefined);
        this.players = [];
        this.status = PartyStatus.FINISHED;
    }

    public endGame() {
        this.status = PartyStatus.LOBBY;
        this.currentGame = undefined;
    }


    public toDTO(): PartyDTO {
        return {
            id: this.id,
            name: this.name,
            maxPlayers: this.maxPlayers,
            players: this.players.map(p => p.toDTO()),
            status: this.status,
            currentGame: this.currentGame?.toDTO(),
            roomCode: this.roomCode
        }
    }

}