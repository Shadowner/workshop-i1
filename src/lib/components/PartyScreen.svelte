<script lang="ts">
  import { callAPI, socket } from "$lib/SocketAPI";
  import { userParty } from "$lib/stores/PresStore";
  import type { PartyDTO } from "../../../server/DTO/PartyDTO";
  import PartyCard from "./PartyCard.svelte";
  import PlayerCard from "./PlayerCard.svelte";

  export let party: PartyDTO;

  const startGame = () => {
    callAPI("pres.party.start");
  };
</script>

<div class="flex flex-col h-full w-full">
  <div class="bg-red-400 w-full h-36 flex items-center justify-between">
    <h1 class="text-4xl text-white font-bold italic pl-10 uppercase">Brise silence</h1>
    <h1 class="text-2xl text-white pr-10">Se déconnecter</h1>
  </div>
  <div class="bg-red-300 h-full flex items-center flex-col justify-around">
    <div class=" flex flex-col justify-center items-center">
      {#if party.players.length === 0}
        <h1 class="text-8xl text-white pr-10 text-center">En attente de joueurs</h1>
      {/if}
      <div class="flex gap-2 flex-wrap w-full">
        {#each party.players as player}
          {#if player.name}
            <PlayerCard bind:userName={player.name} />
          {/if}
        {/each}
      </div>
    </div>
    <div class="flex flex-col space-y-5 items-center">
      <PartyCard>
        <h1 class="font-bold text-7xl text-white">
          <span class="font-thin">Code de la partie :</span> <span class="uppercase"> {party.roomCode}</span>
        </h1>
      </PartyCard>

      {#if party.players.length > 0}
        <div on:click={startGame}>
          <PartyCard>
            <h1 class="text-white font-bold">Lancer la partie</h1>
          </PartyCard>
        </div>
      {/if}
    </div>
  </div>
</div>
