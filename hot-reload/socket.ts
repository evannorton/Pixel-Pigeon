import { io } from "socket.io-client";

const socket = io(location.href, {
  autoConnect: true
});

export default socket;