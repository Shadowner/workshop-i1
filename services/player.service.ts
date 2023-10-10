import { Player } from '../model/player.ts';


const users: Map<string, Player> = new Map();

export function createUser() {
    const user = new Player();
    users.set(user.id, user);
    return user;
}

export function getPlayer(id: string) {
    return users.get(id);
}

export function getUsers(): Player[] {
    return Array.from(users.values());
}

export function removePlayer(id: string) {
    users.delete(id);
}
