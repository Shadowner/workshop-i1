<script lang="ts">
  import { callAPI, socket } from "$lib/SocketAPI";
  let roomCode = "";
  const join = async () => {
    console.log("called");
    socket.emit("coucou");
    const joined = await callAPI("party.join", roomCode).catch((e) => console.error(e));
    console.log(joined);
  };
</script>

<div class="w-full h-full bg-red-300 flex flex-col justify-center items-center align-middle">
  <h1>Brise silence</h1>
  <input bind:value={roomCode} type="text" placeholder="Roomcode" name="" id="" />
  <button class="bg-blue-400 p-5 rounded-sm" on:click={join}>Rejoindre</button>
</div>
