import { PartyDTO } from "../DTO/PartyDTO.ts";
import { createParty, getPartyByRoomCode } from "../services/party.service.ts";
import { AnswerType, GameDTO } from "../DTO/GameDTO.ts";
import { createUser, getPlayer } from "../services/player.service.ts";
import { PlayerDTO } from "../DTO/PlayerDTO.ts";
import { PlayerAnswerDTO } from "../DTO/PlayerAnswerDTO.ts";
import { BasicGameStatus } from "../enum/BasicGameStatus.ts";
import { API_DECLARATION } from "./QuickApi.ts";

export default {
  party: {
    $beforeAll: (req) => {
      if (!req.player) throw new Error("Player not found");
    },
    join: (req, roomCode: string): PartyDTO => {
      const potentialParty = getPartyByRoomCode(roomCode);
      if (!potentialParty) throw new Error("Party not found");
      if (potentialParty.players.length >= potentialParty.maxPlayers) throw new Error("Party is full");
      potentialParty.addPlayer(req.player);
      console.log("joined party", potentialParty.name, "with", potentialParty.players.length, "players");
      return potentialParty.toDTO() as PartyDTO;
    },
    leave: (req): PartyDTO => {
      if (!req.player.currentParty) throw new Error("Player not in a party");
      req.player.currentParty?.removePlayer(req.player);
      return req.player.currentParty?.toDTO() as PartyDTO;
    },
    get: (req): PartyDTO => {
      return req.player.currentParty?.toDTO() as PartyDTO;
    },
    ready: (req): PartyDTO => {
      if (!req.player.currentParty) throw new Error("Player not in a party");
      req.player.currentParty.setReady(req.player);
      return req.player.currentParty.toDTO() as PartyDTO;
    },
  },

  player: {
    subscribe: (req, playerId: string): PlayerDTO => {
      return createUser().toDTO();
    },

    setName: (req, name: string): PlayerDTO => {
      //XXX
      req.player.name = name;
      return req.player.toDTO();
    },
    vote: (req, content: AnswerType): PlayerAnswerDTO<any> => {
      const game = req.player.currentParty?.currentGame;
      if (!game) throw new Error("Game not found");
      const vote = game.addAnswer(req.player, content);
      return vote.toDTO();
    },
    get: (req): PlayerDTO => {
      return req.player.toDTO();
    },
    getById: (_req, playerId: string): PlayerDTO => {
      //FIXME: Not restrained to party players
      const player = getPlayer(playerId);
      if (!player) throw new Error("Player not found");
      return player.toDTO();
    },
  },

  game: {
    get: (req): GameDTO => {
      if (!req.player.currentParty) throw new Error("Player not in a party");
      if (!req.player.currentParty.currentGame) throw new Error("Game not found");
      return req.player.currentParty.currentGame?.toDTO();
    },

    answer: (req, content: AnswerType): PlayerAnswerDTO<any> => {
      const game = req.player.currentParty?.currentGame;
      if (!game) throw new Error("Game not found");
      if (game.basicStatus != BasicGameStatus.VOTING) throw new Error("Game is not in voting status");
      const answer = game.addAnswer(req.player, content);
      return answer.toDTO();
    },
  },

  answer: {
    get: (req): PlayerAnswerDTO<any> | undefined => {
      if (!req.player.currentParty) throw new Error("Player not in a party");
      if (!req.player.currentParty.currentGame) throw new Error("Game not found");
      return req.player.currentParty.currentGame.getAnswer(req.player)?.toDTO();
    },
  },

  setHost: (req) => {
    if (!req.player) throw new Error("Player not found");
    req.player.ISHOST = true;
    return req.player.toDTO();
  },

  // Accessible only to Presentation
  pres: {
    $beforeAll: (req) => {
      if (!req.player) throw new Error("Player not found");
      if (!req.player.ISHOST) throw new Error("Player is not host");
    },
    party: {
      create: (req, name: string, maxPlayers: number = 5) => {
        const party = createParty(name, maxPlayers, req.player!);
        return party.toDTO();
      },
      start: (req) => {
        if (!req.player.currentParty) throw new Error("Player not in a party");
        req.player.currentParty.selectGame();
        return req.player.currentParty.toDTO();
      },
      hosted: (req) => {
        if (!req.player.currentParty) throw new Error("Player not hosted a party");
        return req.player.currentParty.toDTO();
      },
    },
    game: {
      next: (req) => {
        if (!req.player.currentParty) throw new Error("Player not in a party");
        if (!req.player.currentParty.currentGame) throw new Error("Game not found");
        req.player.currentParty.currentGame.next();
        return req.player.currentParty.currentGame.toDTO();
      },
    },
  },
} as const satisfies API_DECLARATION;

/** ENDPOIT A ECOUTER FRONT JOUEUR / le fil d'une parie
 * Party:Update -> (PartyDTO) // Changement d'état de la partie [Inlut l'ajout / supression de joueurs]
 * Game:Update -> (GameDTO) // Définition du jeu (Quizz / Undercover)
 * Game:Start -> (GameDTO + content) // Début du jeu
 *              Pour le undercover regarder UnderCoverGameDTO
 *              Pour le Quizz regarder QuizzGameDTO
 * Game:status:Answer -> (GameDTO + content) // Définit le début d'une phase de vote
 * Game:status:Stats -> (GameDTO + content) //La phrase par rapport à la situation [Pas forcément utilisée]
 * /////// Peut reboucler sur Game:Update
 * Game:End -> (GameDTO) // Fin du jeu
 *
 *
 *
 */
