import { BaseGame } from "../games/BaseGame.ts";
import { UnderCover } from "../games/Undercover/Undercover.ts";
import { Party } from "../model/Party.ts";

const games: (new (party: Party, changeCallback: () => void) => BaseGame<any>)[] = [UnderCover as unknown as new () => BaseGame<any>];

export function getRandomGame(party: Party, changeCallback: () => void) {
  const randomGame = games[Math.floor(Math.random() * games.length)];
  return new randomGame(party, changeCallback);
}
