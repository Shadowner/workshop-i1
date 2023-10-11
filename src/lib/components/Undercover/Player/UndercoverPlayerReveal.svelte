<script lang="ts">
  import PlayerCard from "$lib/components/PlayerCard.svelte";
  import type { PartyDTO } from "../../../../../server/DTO/PartyDTO";
  import type { UndercoverGameDTO } from "../../../../../server/games/Undercover/DTO/UndercoverGameDTO";

  export let party: PartyDTO;

  const harceledId = Object.entries((party.currentGame as UndercoverGameDTO).content.playersRole).find(([_, v]) => v.isHarceled)![0];

  const harceledPlayer = party.players.find((p) => p.id === harceledId);
</script>

<div class="flex flex-col">
  <h2 class="text-4xl font-bold text-white">Le témoin était :</h2>
  <PlayerCard userName={harceledPlayer?.name} />
</div>
