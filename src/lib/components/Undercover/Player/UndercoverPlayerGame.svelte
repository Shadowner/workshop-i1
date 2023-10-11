<script lang="ts">
  import { callAPI } from "$lib/SocketAPI";
  import PartyCard from "$lib/components/PartyCard.svelte";
  import PlayerCard from "$lib/components/PlayerCard.svelte";
  import type { PartyDTO } from "../../../../../server/DTO/PartyDTO";
  import type { PlayerDTO } from "../../../../../server/DTO/PlayerDTO";

  export let party: PartyDTO;
  export let player: PlayerDTO;

  let selectedPlayer: PlayerDTO | null = null;

  const selectPlayer = (votedPlayer: PlayerDTO) => {
    if (selectedPlayer?.id == votedPlayer.id) {
      selectedPlayer = null;
      return;
    }
    selectedPlayer = votedPlayer;
  };

  const sendVote = async () => {
    if (!selectedPlayer) return;
    await callAPI("game.answer", selectedPlayer.id);
  };
</script>

<div class="w-full h-full p-6 space-y-10 flex flex-col justify-between">
  {#if party.currentGame?.content.playersRole[player.id]}
    <div class="flex bg-white p-5 rounded-xl shadow-xl flex-col">
      <h2 class="text-red-400 font-bold text-center text-2xl">{party.currentGame.content.playersRole[player.id].isHarceled ? "VOUS ÊTES LE TEMOIN DISCRET" : "Vous avez une situation normal"} :</h2>
      <p class="text-justify text-3xl text-red-300">{party.currentGame.content.playersRole[player.id].content}</p>
    </div>
  {:else}
    <div>
      <h2 class="text-red-400 font-bold text-center text-2xl">Chargement de la situation</h2>
    </div>
  {/if}
  <div class="bg-red-400 p-3 rounded-full">
    <p class="text-white font-semibold">Selon vous, qui est le témoin ?</p>
  </div>
  <div class="overflow-x-scroll space-x-4 flex">
    {#each party.players as partyPlayer}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={(e) => {
          selectPlayer(partyPlayer);
        }}
      >
        <PlayerCard bind:userName={partyPlayer.name} ready={selectedPlayer?.id == partyPlayer.id} />
      </div>
    {/each}
  </div>
  <div on:click={sendVote}>
    <PartyCard>
      <div class="text-center">
        <button class="text-white font-bold text-2xl text-center">Voter</button>
      </div>
    </PartyCard>
  </div>
</div>
