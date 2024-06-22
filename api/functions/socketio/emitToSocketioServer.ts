import { state } from "../../state";

export interface EmitToSocketIOServerOptions<Request extends object> {
  data: Request;
  event: string;
}
export const emitToSocketioServer = <Request extends object>(
  options: EmitToSocketIOServerOptions<Request>,
): void => {
  if (state.values.socket === null) {
    throw new Error("Attempted to emit to socket.io server with no socket.");
  }
  state.values.socket.emit(options.event, options.data);
};
