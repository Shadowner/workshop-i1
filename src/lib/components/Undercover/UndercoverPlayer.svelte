<script lang="ts">
  import { callAPI } from "$lib/SocketAPI";
  import { UnderCoverStatusEnum } from "$lib/types/UndercoverStatus";
  import type { PartyDTO } from "../../../../server/DTO/PartyDTO";
  import type { PlayerDTO } from "../../../../server/DTO/PlayerDTO";
  import type { UndercoverGameDTO } from "../../../../server/games/Undercover/DTO/UndercoverGameDTO";
  import AppLayout from "../AppLayout.svelte";
  import PartyCard from "../PartyCard.svelte";
  import PlayerCard from "../PlayerCard.svelte";
  import UndercoverPlayerGame from "./Player/UndercoverPlayerGame.svelte";
  import UndercoverPlayerReveal from "./Player/UndercoverPlayerReveal.svelte";

  export let party: PartyDTO;
  export let player: PlayerDTO;

  $: undervoceredGame = party.currentGame! as UndercoverGameDTO;
</script>

<AppLayout>
  <div slot="header">
    <h1 class="text-4xl text-center text-white font-bold italic uppercase">{party.currentGame?.name}</h1>
    <p class="text-white">Connecté(e) en tant que {player.name}</p>
  </div>
  {#if undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.IN_GAME || undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.VOTE}
    <UndercoverPlayerGame {party} {player} />
  {/if}
  {#if undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.REVEAL}
    <UndercoverPlayerReveal {party} />
  {/if}
  {#if undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.STATS}
    <h1 class="text-white text-5xl text-center font-bold">Regardez l'écran de l'host</h1>
  {/if}
</AppLayout>
