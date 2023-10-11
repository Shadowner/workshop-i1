<script lang="ts">
  export let value: string;
  export let label: string;
</script>

<div class="flex w-full px-10 flex-col">
  <p class="text-red-400 font-bold">{label}</p>
  <input class="rounded-full shadow-xl w-full py-2 px-3" bind:value type="text" name="" id="" />
</div>
