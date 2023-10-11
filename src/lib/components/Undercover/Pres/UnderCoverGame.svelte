<script lang="ts">
  import PlayerCard from "$lib/components/PlayerCard.svelte";
  import type { PartyDTO } from "../../../../../server/DTO/PartyDTO";

  export let party: PartyDTO;
</script>

<div class="flex flex-col items-center justify-center h-full w-full space-y-10">
  <div class=" space-x-4">
    {#each party.players as partyPlayer}
      <PlayerCard bind:userName={partyPlayer.name} ready={partyPlayer.hasVoted} />
    {/each}
  </div>
  <div class="bg-red-400 text-7xl w-4/5 rounded-2xl shadow-xl p-5 text-center mx-9">
    <h2 class="text-white font-semibold">{party.players.filter((x) => x.hasVoted).length}/{party.players.length} joueurs ont voté.</h2>
  </div>
</div>
