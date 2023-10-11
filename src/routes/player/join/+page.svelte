<script lang="ts">
  let name = "";
  const setName = () => {};
</script>

<div class="w-full h-full bg-red-300 flex flex-col justify-center items-center align-middle">
  <h1>Voici la room</h1>
  <input bind:value={name} type="text" placeholder="Ton nom" name="" id="" />
  <button class="bg-blue-400 p-5 rounded-sm" on:click={setName}>Confirmer</button>
</div>
