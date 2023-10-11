import { Socket } from "npm:socket.io";
import { Player } from "../model/player.ts";

const users: Map<string, Player> = new Map();
const userSocket: Map<string, Socket> = new Map();
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
  userSocket.delete(id);
  console.log("removed player", id);
}

export function setPlayerSocket(id: string, socket: Socket) {
  userSocket.set(id, socket);
}

export function removePlayerSocket(id: string) {
  userSocket.delete(id);
}
