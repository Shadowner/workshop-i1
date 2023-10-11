<script lang="ts">
  export let userName: string | undefined;
  export let ready: boolean = true;
</script>

{#if ready}
  <div class="bg-[#F6BD60] rounded shadow-lg p-2 aspect-square h-full">
    <div class="bg-[#F7EDE2] p-2 rounded-lg aspect-square">
      <div class="bg-[#F6BD60] rounded-lg flex flex-col p-4 aspect-square items-center justify-center w-full">
        <p class="text-zinc-100 font-semibold">{userName}</p>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-zinc-500 rounded shadow-lg p-2 aspect-square h-full">
    <div class="bg-[#F7EDE2] p-2 rounded-lg aspect-square">
      <div class="bg-zinc-500 rounded-lg flex flex-col p-4 aspect-square items-center justify-center w-full">
        <p class="text-zinc-100 font-semibold">{userName}</p>
      </div>
    </div>
  </div>
{/if}
