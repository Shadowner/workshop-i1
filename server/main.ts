import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import { compileAPI, type Requester } from "https://deno.land/x/quickapi@v0.0.4/mod.ts";
import coucou from "./api/MainApi.ts";
import { createUser, getPlayer, removePlayer } from './services/player.service.ts';
import { Player } from './model/player.ts';
import { createParty } from "./services/party.service.ts";
import { readLines } from "https://deno.land/std@0.203.0/io/mod.ts";
import { getParty } from './services/party.service.ts';
import { Socket } from 'https://deno.land/x/socket_io@0.1.1/packages/engine.io/lib/socket.ts';
import { serve } from "https://deno.land/std@0.150.0/http/server.ts";

const api = compileAPI(coucou);
export const io = new Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
    let player = createUser();

    socket.on("coucou", () => {
        console.log("coucou")
    });

    socket.on("api", async (endpoint, response, args) => {
        console.log("Call on api")
        if (endpoint == "setHost") {
            player.ISHOST = true;
            socket.emit(`${response}@success`, player.toDTO());
            return;
        }

        if (endpoint == "player:subscribe") {
            const savedPlayer = getPlayer(args[0]);
            if (!savedPlayer) {
                socket.emit("player:subscribe@error", "Player not found");
                return;
            }

            removePlayer(player.id)
            player = savedPlayer;
            player.socket = socket as unknown as Socket;
            socket.emit(`${response}@success`, player);
            return;
        }

        console.log("endpoint appelé", endpoint, response, args)
        try {
            const requester: Requester = { player: player, uid: player.id };
            const result = await api.call(endpoint, requester, ...args);

            socket.emit(`${response}@success`, result);
        } catch (e) {
            socket.emit(`${response}@error`, e);
        }
    })
});

// (async function () {
//     for await (const line of readLines(Deno.stdin)) {
//         if (line.startsWith("start/")) {
//             const [_, gameId] = line.split("/");
//             const party = getParty(gameId);
//             if (!party) {
//                 console.log("Party not found");
//                 continue;
//             }
//             party.startGame();
//             console.log("Party started");
//         }
//         if (line.startsWith("stop/")) {
//             const [_, gameId] = line.split("/");
//             const party = getParty(gameId);
//             if (!party) {
//                 console.log("Party not found");
//                 continue;
//             }
//             party.endParty();
//             console.log("Party ended");
//         }
//         if (line.startsWith("reset/")) {
//             const [_, gameId] = line.split("/");
//             const party = getParty(gameId);
//             if (!party) {
//                 console.log("Party not found");
//                 continue;
//             }
//             party.resetGame();
//             console.log("Party reset");
//         }
//         if (line.startsWith("create/")) {
//             const [_, name, player] = line.split("/");
//             const newParty = createParty(name, parseInt(player), new Player());
//             console.log(newParty.toDTO());

//         }
//     }
// })();



await serve(io.handler(), {
    port: 3000,
});

// You can add shortcut if you define an importmap
declare module "https://deno.land/x/quickapi@v0.0.4/mod.ts" {
    export interface Requester {
        player: Player
    }
}