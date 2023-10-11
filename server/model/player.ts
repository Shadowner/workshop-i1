import { Party } from "./Party.ts";
import { PlayerDTO } from "../DTO/PlayerDTO.ts";
import { Socket } from "npm:socket.io";
export class Player {
  public id = crypto.randomUUID();
  public currentParty?: Party;
  public score = 0;
  public name?: string;
  public socket?: Socket;
  public ISHOST = false;
  public isReady = false;

  public hasVoted = false;

  public toDTO(): PlayerDTO {
    return {
      id: this.id,
      name: this.name,
      hasVoted: this.hasVoted,
      isReady: this.isReady,
    };
  }
}
