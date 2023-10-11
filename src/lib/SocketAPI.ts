import { io } from "socket.io-client"
import type API from "../../server/api/MainApi"
import { initAPI } from "./QuickApi";

export const socket = io("http://localhost:3000/", {
    secure: false,
    autoConnect: true,
});

await new Promise((res) => {
    console.log("waiting for connection");
    socket.on("connect", () => { res(undefined) });
    console.log("connected")
});

export const { callAPI } = initAPI<typeof API>((endpoint, ...args) => {
    return new Promise((res, rej) => {
        const idResponse = crypto?.randomUUID?.() ?? Math.random();
        console.log("api", endpoint, idResponse, args)
        socket.emit("api", endpoint, idResponse, args);
        console.log("api sent");
        const clear = () => {
            console.log("clearing")
            socket.removeAllListeners(`${idResponse}@success`);
            socket.removeAllListeners(`${idResponse}@error`);
        }
        socket.on(`${idResponse}@success`, (result) => {
            console.info(result)
            res(result);
            clear();
        })
        socket.on(`${idResponse}@error`, (err) => {
            console.error(err);
            rej(err);
            clear();
        })
    })
});

socket.onAny((event, ...args) => {
    console.log("any:", event, args)
});

callAPI("player.get")

socket.on("connect", () => {
    console.log("connected")
    callAPI("player.get")
})

socket.on("connect_error", (er) => {
    console.error(er);
})
