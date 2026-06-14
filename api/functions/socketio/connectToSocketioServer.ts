import { Socket, io } from "socket.io-client";
import { state } from "../../state";

export interface ConnectToSocketioServerOptions {
  auth?: {
    [key: string]: unknown;
  };
  readonly onConnect?: () => void;
  readonly onDisconnect?: (reason: string) => void;
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
  if (typeof options.onConnect !== "undefined") {
    const onConnect: () => void = options.onConnect;
    socket.on("connect", (): void => {
      onConnect();
    });
  }
  if (typeof options.onDisconnect !== "undefined") {
    const onDisconnect: (reason: string) => void = options.onDisconnect;
    socket.on("disconnect", (reason: string): void => {
      onDisconnect(reason);
    });
  }
  socket.connect();
  state.setValues({
    socket,
  });
};
