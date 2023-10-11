import { PlayerDTO } from './PlayerDTO.ts';
import { PartyStatus } from '../enum/PartyStatus.ts';
import { GameDTO } from "./GameDTO.ts";
export interface PartyDTO {
    id: string;
    name: string;
    roomCode: string;
    players: PlayerDTO[];
    maxPlayers: number;
    status: PartyStatus;
    currentGame?: GameDTO;
}