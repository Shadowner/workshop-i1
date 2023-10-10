import { initAPI } from "https://deno.land/x/quickapi/client.ts";
import { io } from "npm:socket.io-client"
import type API from "./api/MainApi.ts";

const socket = io();

const { callAPI } = initAPI<typeof API>((endpoint, ...args) => {
    return new Promise((res, rej) => {
        const idResponse = crypto?.randomUUID?.() ?? Math.random();
        socket.emit("api", endpoint, idResponse, args);
        const clear = () => {
            socket.removeAllListeners(`${idResponse}@success`);
            socket.removeAllListeners(`${idResponse}@error`);
        }
        socket.on(`${idResponse}@success`, (result) => {
            res(result);
            clear();
        })
        socket.on(`${idResponse}@error`, (err) => {
            rej(err);
            clear();
        })
    })
});

callAPI("pres.game.create");