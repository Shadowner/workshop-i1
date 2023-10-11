import { BaseGame } from '../games/BaseGame.ts';
import { UnderCover } from '../games/Undercover/Undercover.ts';

const games: (new () => BaseGame<any>)[] = [UnderCover as unknown as new () => BaseGame<any>];

export function getRandomGame() {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    return new randomGame();
}

