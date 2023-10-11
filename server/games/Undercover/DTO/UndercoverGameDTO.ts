import { GameDTO } from "../../../DTO/GameDTO.ts";
import { PlayerId } from "../../../DTO/PlayerDTO.ts";
import { GameCardDTO } from "./GameCardDTO.ts";
import { UnderCoverStatusEnum } from "./UndercoverStatus.ts";

export interface UndercoverGameDTO extends GameDTO {
  content: {
    playersRole: Record<PlayerId, GameCardDTO>;
    underCoverStatus: UnderCoverStatusEnum;
  };
}
