import { Party } from '../model/Party.ts';
import { Player } from '../model/player.ts';

const parties: Party[] = [];

export function createParty(name: string, maxPlayers: number, pres: Player) {
    const party = new Party(name, maxPlayers, pres);
    parties.push(party);
    return party;
}

export function getParty(id: string) {
    return parties.find(p => p.id === id);
}

export function getPartyByRoomCode(roomCode: string) {
    return parties.find(p => p.roomCode === roomCode);
}

export function getParties() {
    return parties;
}

export function deleteParty(id: string) {
    const party = getParty(id);
    if (!party) return;
    parties.splice(parties.indexOf(party), 1);
}
