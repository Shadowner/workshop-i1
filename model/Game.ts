export class Game {
    public id = crypto.randomUUID();

    constructor(
        public name: string,

    ) { }
}