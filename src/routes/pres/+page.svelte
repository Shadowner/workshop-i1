<script lang="ts">
  import { goto } from "$app/navigation";
  import { callAPI, launchOnConnect, socket } from "$lib/SocketAPI";
  import DiscoverGameScreen from "$lib/components/DiscoverGameScreen.svelte";
  import PartyCard from "$lib/components/PartyCard.svelte";
  import PartyScreen from "$lib/components/PartyScreen.svelte";
  import UndercoverPres from "$lib/components/Undercover/UndercoverPres.svelte";
  import { setCurrentPlayerAsHost, useHostPlayer, useIsHostSet, userParty as useParty, userParty } from "$lib/stores/PresStore";
  import { PartyStatus } from "$lib/types/PartyStatus";
  import type { PartyDTO } from "../../../server/DTO/PartyDTO";

  const isHost = useIsHostSet();
  const party = useParty();
  const hostPlayer = useHostPlayer();
  const savedUserId = localStorage.getItem("hostPayerId");

  let name = "Brise Silence";

  launchOnConnect(async () => {
    if (!savedUserId) {
      return setCurrentPlayerAsHost();
    }

    const player = await callAPI("player.subscribe", savedUserId).catch((e) => {
      return null;
    });

    if (!player) {
      await setCurrentPlayerAsHost();
      window.location.reload();

      return;
    }
    hostPlayer.set(player);
    const potentialParty = await callAPI("pres.party.hosted");

    if (!potentialParty) {
      return;
    }
    console.log(potentialParty);

    userParty().set(potentialParty);
    $party = potentialParty;
  });

  socket.on("party.update", (party: PartyDTO) => {
    console.log(party);
    userParty().set(party);
    $party = party;
  });

  const createRoom = async () => {
    const room = await callAPI("pres.party.create", name).catch((e) => {
      console.error(e);
      return null;
    });
    console.log(room);

    if (room) {
      party.set(room);
      $party = room;
    }
  };
</script>

{#if isHost && $party == null}
  <div class="flex flex-col h-full w-full">
    <div class="bg-red-400 w-full h-36 flex items-center justify-between">
      <h1 class="text-4xl text-white font-bold italic pl-10 uppercase">Brise silence</h1>
    </div>
    <div class="bg-red-300 h-full flex items-center flex-col justify-around">
      <div class="w-1/2 h-1/2 flex flex-col justify-center items-center">
        <PartyCard>
          <div class="flex flex-col">
            <h1 class="text-white font-bold text-7xl">Créer une partie</h1>
            <div class="flex flex-col">
              <p class="text-white">Nom de la room</p>
              <input type="text" class="text-black text-4xl font-bold rounded-xl p-2" bind:value={name} />
            </div>
            <button class="text-white text-4xl font-bold bg-red-300 w-fit self-center m-2 p-2 rounded-full" on:click={createRoom}>Créer</button>
          </div>
        </PartyCard>
      </div>
    </div>
  </div>
{/if}

{#if $party && $party.status === PartyStatus.LOBBY}
  <PartyScreen bind:party={$party} />
{/if}

{#if $party && $party.status === PartyStatus.DISCOVERING && $party.currentGame}
  <DiscoverGameScreen bind:party={$party} />
{/if}

{#if $party && $party.status === PartyStatus.PLAYING && $party.currentGame && $party.currentGame.id === 1}
  <UndercoverPres bind:party={$party} />
{/if}
