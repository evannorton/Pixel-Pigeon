import { io } from "socket.io-client";

export const socket = io(location.href, {
  autoConnect: true
});
