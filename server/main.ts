import { compileAPI, type Requester } from "https://deno.land/x/quickapi@v0.0.4/mod.ts";
import coucou from "./api/MainApi.ts";
import { createUser, getPlayer, removePlayer, removePlayerSocket, setPlayerSocket } from "./services/player.service.ts";
import { Player } from "./model/player.ts";
import { createParty } from "./services/party.service.ts";
import { readLines } from "https://deno.land/std@0.203.0/io/mod.ts";
import { getParty } from "./services/party.service.ts";
import { Server as IOserver } from "npm:socket.io";

const api = compileAPI(coucou);
export const io = new IOserver(3000, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Nouvelle connexion");
  let player = createUser();
  player.socket = socket;

  socket.on("api", async (endpoint, response, args) => {
    console.log("API call", endpoint, args);
    if (endpoint == "setHost") {
      player.ISHOST = true;
      socket.emit(`${response}@success`, player.toDTO());
      console.log("Host set", player.id);
      return;
    }

    if (endpoint == "player.subscribe") {
      const savedPlayer = getPlayer(args[0]);
      if (!savedPlayer) {
        socket.emit(`${response}@error`, "Player not found");
        console.log("Player not found", args[0]);
        return;
      }
      if (savedPlayer.id != player.id) {
        removePlayer(player.id);
        player = savedPlayer;
        player.socket = socket;
      }
      socket.emit(`${response}@success`, player.toDTO());
      console.log("Player subscribed", savedPlayer.id);
      return;
    }

    try {
      const requester: Requester = { player: player, uid: player.id };
      const result = await api.call(endpoint, requester, ...args);
      socket.emit(`${response}@success`, result);
      return;
    } catch (e) {
      console.error(e);
      socket.emit(`${response}@error`, e.toString());
      return;
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    player.currentParty?.removePlayer(player);
  });
});

(async function () {
  for await (const line of readLines(Deno.stdin)) {
    if (line.startsWith("start/")) {
      const [_, gameId] = line.split("/");
      const party = getParty(gameId);
      if (!party) {
        console.log("Party not found");
        continue;
      }
      party.selectGame();
      console.log("Party started");
    }
    if (line.startsWith("stop/")) {
      const [_, gameId] = line.split("/");
      const party = getParty(gameId);
      if (!party) {
        console.log("Party not found");
        continue;
      }
      party.endParty();
      console.log("Party ended");
    }
    if (line.startsWith("reset/")) {
      const [_, gameId] = line.split("/");
      const party = getParty(gameId);
      if (!party) {
        console.log("Party not found");
        continue;
      }
      party.reset();
      console.log("Party reset");
    }
    if (line.startsWith("create/")) {
      const [_, name, player] = line.split("/");
      const newParty = createParty(name, parseInt(player), new Player());
      console.log(newParty.toDTO());
    }
  }
})();

// await serve(io, {
//   port: 3000,
// });

// You can add shortcut if you define an importmap
declare module "https://deno.land/x/quickapi@v0.0.4/mod.ts" {
  export interface Requester {
    player: Player;
  }
}
