<script lang="ts">
  import { UnderCoverStatusEnum } from "$lib/types/UndercoverStatus";
  import type { PartyDTO } from "../../../../server/DTO/PartyDTO";
  import type { UndercoverGameDTO } from "../../../../server/games/Undercover/DTO/UndercoverGameDTO";
  import AppLayout from "../AppLayout.svelte";
  import PlayerCard from "../PlayerCard.svelte";
  import UndercoverPlayerReveal from "./Player/UndercoverPlayerReveal.svelte";
  import UnderCoverGame from "./Pres/UnderCoverGame.svelte";

  export let party: PartyDTO;
  $: undervoceredGame = party.currentGame! as UndercoverGameDTO;
</script>

<AppLayout>
  <div slot="header">
    <h1 class="text-4xl text-center text-white font-bold italic uppercase">{party.currentGame?.name}</h1>
  </div>

  {#if undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.IN_GAME || undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.VOTE}
    <UnderCoverGame {party} />
  {/if}
  {#if undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.REVEAL}
    <UndercoverPlayerReveal {party} />
  {/if}
  {#if undervoceredGame.content.underCoverStatus === UnderCoverStatusEnum.STATS}
    <p>Pourquoi c'est vachement triste quand même</p>
  {/if}
</AppLayout>
