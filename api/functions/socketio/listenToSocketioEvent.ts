import { state } from "../../state";

export interface ListenToSocketioEventOptions<Message extends object> {
  event: string;
  onMessage: (message: Message) => void;
}
export const listenToSocketioEvent = <Message extends object>(
  options: ListenToSocketioEventOptions<Message>,
): void => {
  if (state.values.socket === null) {
    throw new Error("Attempted to listen to socket.io event with no socket.");
  }
  state.values.socket.on(options.event, (message: Message): void => {
    options.onMessage(message);
  });
};
