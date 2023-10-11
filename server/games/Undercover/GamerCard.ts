export class GameCard {
  public id = crypto.randomUUID();

  constructor(public isHarceled: boolean, public content: string, public why?: string) {}
}
