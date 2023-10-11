import type { PartyDTO } from "../../../server/DTO/PartyDTO";
import { useWritable } from "./UseSharedStore";
import type { PlayerDTO } from "../../../server/DTO/PlayerDTO";
import { callAPI } from "$lib/SocketAPI";
import { writable } from "svelte/store";
import type { GameDTO } from "../../../server/DTO/GameDTO";
import type { PlayerAnswerDTO } from "../../../server/DTO/PlayerAnswerDTO";

export const useIsHostSet = () => writable(false);
export const userParty = () => writable<PartyDTO | null>(null);
export const useHostPlayer = () => writable<PlayerDTO | null>(null);
export const useGame = () => writable<GameDTO | null>(null);
export const useAnswers = () => writable<PlayerAnswerDTO<any>[]>([]);
export const userAnswer = () => writable<PlayerAnswerDTO<any> | null>(null);

export const setCurrentPlayerAsHost = async () => {
  const player = await callAPI("setHost");
  useHostPlayer().set(player);
  useIsHostSet().set(true);
  localStorage.setItem("hostPayerId", player.id);
};

export const setPlayerFromSavedId = async (playerId: string) => {
  await callAPI("player.subscribe", playerId);
};

export const setGetAsHost = async () => {
  const player = await callAPI("player.get");
  useHostPlayer().set(player);
  useIsHostSet().set(true);
  localStorage.setItem("hostPayerId", player.id);
};
