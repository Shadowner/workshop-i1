import { io } from "socket.io-client";
import type API from "../../server/api/MainApi";
import { initAPI } from "./QuickApi";

export const socket = io("http://192.168.1.149:3000/", {
  secure: false,
  autoConnect: true,
});

export const { callAPI } = initAPI<typeof API>((endpoint, ...args) => {
  return new Promise((res, rej) => {
    const idResponse = crypto?.randomUUID?.() ?? Math.random();
    socket.emit("api", endpoint, idResponse, args);
    const clear = () => {
      socket.removeAllListeners(`${idResponse}@success`);
      socket.removeAllListeners(`${idResponse}@error`);
    };
    socket.on(`${idResponse}@success`, (result) => {
      console.debug(result);
      res(result);
      clear();
    });
    socket.on(`${idResponse}@error`, (err) => {
      console.error(err);
      rej(err);
      clear();
    });
  });
});

export const launchOnConnect = (cb: () => void) => {
  if (socket.connected) cb();
  else socket.on("connect", cb);
};
