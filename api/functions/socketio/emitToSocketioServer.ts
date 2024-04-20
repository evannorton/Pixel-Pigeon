import { state } from "../../state";

export interface EmitToSocketIOServerOptions {
  data?: unknown;
  event: string;
}
export const emitToSocketioServer = (
  options: EmitToSocketIOServerOptions,
): void => {
  if (state.values.socket === null) {
    throw new Error("Attempted to emit to socket.io server without no socket.");
  }
  state.values.socket.emit(options.event, options.data);
};
