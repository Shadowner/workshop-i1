<script lang="ts">
  import { callAPI, launchOnConnect, socket } from "$lib/SocketAPI";
  import AppLayout from "$lib/components/AppLayout.svelte";
  import PartyCard from "$lib/components/PartyCard.svelte";
  import PlayerInput from "$lib/components/Player/PlayerInput.svelte";
  import PlayerCard from "$lib/components/PlayerCard.svelte";
  import UndercoverPlayer from "$lib/components/Undercover/UndercoverPlayer.svelte";
  import { useGame, useHostPlayer, useIsHostSet, userAnswer, userParty } from "$lib/stores/PresStore";
  import { PartyStatus } from "$lib/types/PartyStatus";
  import type { PartyDTO } from "../../../server/DTO/PartyDTO";
  import type { PlayerDTO } from "../../../server/DTO/PlayerDTO";

  let player: PlayerDTO | null = null;
  const party = userParty();
  const game = useGame();
  const answer = userAnswer();

  launchOnConnect(async () => {
    console.log("connected");
    const potentialId = localStorage.getItem("playerId");
    if (!potentialId) {
      console.log("no id saved");
      const toSave = await callAPI("player.get");
      localStorage.setItem("playerId", toSave.id);
      player = toSave;
      player = toSave;
    } else {
      console.log("id saved", potentialId);
      const potentialPlayer = await callAPI("player.subscribe", potentialId).catch((e) => null);
      if (potentialPlayer) {
        console.log("playerfetched", potentialPlayer);
        player = potentialPlayer;
        player = potentialPlayer;
        pseudo = potentialPlayer.name ?? "";
      } else {
        console.log("no player found, saving a new one");
        window.location.reload();
        const toSave = await callAPI("player.get");
        localStorage.setItem("playerId", toSave.id);
      }
    }

    const potentialParty = await callAPI("party.get").catch((e) => null);
    if (!potentialParty) {
      return;
    }
    console.log(potentialParty);
    party.set(potentialParty);
    $party = potentialParty;

    const potentialGame = await callAPI("game.get").catch((e) => null);
    if (potentialGame) {
      console.log(potentialGame);
      game.set(potentialGame);
      $game = potentialGame;
    }

    const potentialAnswer = await callAPI("answer.get").catch((e) => null);
    if (potentialAnswer) {
      console.log(potentialAnswer);
      answer.set(potentialAnswer);
      $answer = potentialAnswer;
    }
  });

  let pseudo = "";
  let roomCode = "";
  const join = async () => {
    console.log("called");
    socket.emit("coucou");
    await callAPI("player.setName", pseudo).catch((e) => console.error(e));
    const joined = await callAPI("party.join", roomCode.toLowerCase()).catch((e) => console.error(e));
    if (joined) {
      party.set(joined);
      $party = joined;
    }
  };

  const leave = async () => {
    await callAPI("party.leave").catch((e) => console.error(e));
    party.set(null);
    $party = null;
  };

  const setReady = () => {
    callAPI("party.ready").catch((e) => console.error(e));
  };

  socket.on("party.update", (party: PartyDTO) => {
    console.log(party);
    userParty().set(party);
    $party = party;

    let test = party.players.find((p) => p.id === player?.id) ?? null;
    player = test;
  });
</script>

{#if $party == null}
  <AppLayout>
    <div slot="header" class="">
      <h1 class="text-5xl text-center text-white font-bold italic uppercase">Brise silence</h1>
    </div>
    <div class=" flex flex-col justify-center items-center space-y-12">
      <PlayerInput label="Votre Pseudo" bind:value={pseudo} />
      <PlayerInput label="Code de la salle" bind:value={roomCode} />
      <div on:click={join}>
        <PartyCard>
          <h1 class="text-white font-bold">SE CONNECTER</h1>
        </PartyCard>
      </div>
    </div>
  </AppLayout>
{/if}

{#if $party && $party.status === PartyStatus.LOBBY}
  <AppLayout>
    <div slot="header">
      <h1 class="text-5xl text-center text-white font-bold italic uppercase">Brise silence</h1>
      <p class="text-white text-center">Connecté(e) en tant que {player?.name}</p>
    </div>
    <div class="flex flex-col items-center justify-around h-full">
      <h1>En attente des autres joueurs</h1>
      <div class="flex flex-wrap gap-2">
        {#each $party.players as player}
          {#if player.name}
            <PlayerCard bind:userName={player.name} />
          {/if}
        {/each}
      </div>
      <div on:click={leave}>
        <PartyCard>
          <h1 class="text-white font-bold">Partir</h1>
        </PartyCard>
      </div>
    </div>
  </AppLayout>
{/if}

{#if $party && $party.status === PartyStatus.DISCOVERING && $party.currentGame}
  <AppLayout>
    <div slot="header">
      <h1 class="text-4xl text-center text-white font-bold italic uppercase">{$party.currentGame?.name}</h1>
      <p class="text-white">Connecté(e) en tant que {player?.name}</p>
    </div>
    <div class="flex flex-col items-center justify-around h-full">
      <div on:click={setReady}>
        <PartyCard>
          <h1 class="text-white font-bold">{player?.isReady ? "Je ne suis pas prêt" : "Je suis prêt"}</h1>
        </PartyCard>
      </div>
    </div>
  </AppLayout>
{/if}

{#if $party && $party.status === PartyStatus.PLAYING && $party.currentGame && $party.currentGame.id === 1 && player}
  <UndercoverPlayer bind:party={$party} bind:player />
{/if}

<style scoped>
  .test {
    /* transform: scale(0.65); */
  }
</style>
