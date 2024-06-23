import { state } from "../../state";

export interface EmitToSocketIOServerOptions<Message extends object> {
  data: Message;
  event: string;
}
export const emitToSocketioServer = <Message extends object>(
  options: EmitToSocketIOServerOptions<Message>,
): void => {
  if (state.values.socket === null) {
    throw new Error("Attempted to emit to socket.io server with no socket.");
  }
  state.values.socket.emit(options.event, options.data);
};
