<script lang="ts">
  import type { GameDTO } from "../../../server/DTO/GameDTO";
  import type { PartyDTO } from "../../../server/DTO/PartyDTO";
  import AppLayout from "./AppLayout.svelte";
  import PlayerCard from "./PlayerCard.svelte";

  export let party: PartyDTO;
</script>

<AppLayout>
  <div slot="header">
    <h1 class="text-4xl text-white font-bold italic pl-10 uppercase">Brise silence</h1>
  </div>
  <div class="flex flex-col text-center justify-around h-full">
    {#if party.currentGame}
      <div class="flex flex-col items-center">
        <h1 class="text-3xl text-gray-600">Bienvenue dans le jeu :</h1>
        <h1 class="text-white text-7xl font-bold">{party.currentGame.name}</h1>
        <p>{party.currentGame.description}</p>
      </div>
    {/if}

    <div class="flex flex-col">
      <p>En attente que les joueurs soient prêts</p>
      <div class="flex space-x-5 flex-wrap w-full">
        {#each party.players as player}
          {#if player.name}
            <PlayerCard bind:userName={player.name} bind:ready={player.isReady} />
          {/if}
        {/each}
      </div>
    </div>
  </div>
</AppLayout>
