import { Player } from "./player.ts";
import { PartyStatus } from "../enum/PartyStatus.ts";
import { BaseGame } from "../games/BaseGame.ts";
import { getRandomGame } from "../services/game.service.ts";
import { PartyDTO } from "../DTO/PartyDTO.ts";
import { BasicGameStatus } from "../enum/BasicGameStatus.ts";

export class Party {
  public id = crypto.randomUUID();
  public players: Player[] = [];

  public status: PartyStatus = PartyStatus.LOBBY;
  public currentGame?: BaseGame<any>;
  public roomCode: string;

  constructor(public name: string, public maxPlayers: number, public presentateur?: Player) {
    this.roomCode = crypto.randomUUID().slice(0, 5);
    if (presentateur) presentateur.currentParty = this;
  }

  public addPlayer(player: Player) {
    if (this.players.includes(player)) throw new Error("Player already in party");
    this.players.push(player);
    player.currentParty = this;
    this.broadcastChange();
  }

  public removePlayer(player: Player) {
    if (this.status != PartyStatus.LOBBY || this.presentateur == player) return;
    player.currentParty = undefined;
    this.players = this.players.filter((p) => p.id !== player.id);
    this.broadcastChange();
  }

  public selectGame() {
    this.status = PartyStatus.DISCOVERING;
    this.currentGame = getRandomGame(this, () => this.gameChangeCallback());
    this.broadcastChange();
  }

  public gameChangeCallback() {
    if (this.currentGame?.basicStatus === BasicGameStatus.ENDED) {
      this.reset();
    }
    this.broadcastChange();
  }

  public reset() {
    this.status = PartyStatus.LOBBY;
    this.players.forEach((p) => (p.isReady = false));
    this.players.forEach((p) => (p.hasVoted = false));
    this.currentGame = undefined;
  }

  public endParty() {
    this.players.forEach((p) => (p.currentParty = undefined));
    this.players = [];
    this.status = PartyStatus.FINISHED;
  }

  public endGame() {
    this.status = PartyStatus.LOBBY;
    this.currentGame = undefined;
    this.broadcastChange();
  }

  public broadcastChange() {
    this.players.forEach((p) => p.socket?.emit("party.update", this.toDTO()));
    this.presentateur?.socket?.emit("party.update", this.toDTO());
  }

  public setReady(player: Player) {
    if (this.status != PartyStatus.DISCOVERING) return;
    player.isReady = !player.isReady;
    if (this.players.every((p) => p.isReady)) {
      this.status = PartyStatus.PLAYING;
      this.players.forEach((p) => (p.isReady = false));
      this.currentGame?.start();
    }
    this.broadcastChange();
  }

  public startGame() {
    if (this.status != PartyStatus.DISCOVERING) return;
    this.status = PartyStatus.PLAYING;
    this.currentGame?.start();
    this.broadcastChange();
  }

  public toDTO(): PartyDTO {
    return {
      id: this.id,
      name: this.name,
      maxPlayers: this.maxPlayers,
      players: this.players.map((p) => p.toDTO()),
      status: this.status,
      currentGame: this.currentGame?.toDTO(),
      roomCode: this.roomCode,
    };
  }
}
