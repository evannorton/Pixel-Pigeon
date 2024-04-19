import { Socket, io } from "socket.io-client";
import { state } from "../../state";

export interface ConnectToSocketioServerOptions {
  auth?: {
    [key: string]: unknown;
  };
  url: string;
}
export const connectToSocketioServer = (
  options: ConnectToSocketioServerOptions,
): void => {
  const socket: Socket = io(options.url, {
    auth: options.auth,
    autoConnect: false,
    closeOnBeforeunload: false,
  });
  socket.connect();
  state.setValues({
    socket,
  });
};
