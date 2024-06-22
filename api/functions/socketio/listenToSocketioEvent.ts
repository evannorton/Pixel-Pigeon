import { state } from "../../state";

export interface ListenToSocketioEventOptions<Update extends object> {
  event: string;
  onMessage: (message: Update) => void;
}
export const listenToSocketioEvent = <Update extends object>(
  options: ListenToSocketioEventOptions<Update>,
): void => {
  if (state.values.socket === null) {
    throw new Error("Attempted to listen to socket.io event with no socket.");
  }
  state.values.socket.on(options.event, (message: Update): void => {
    options.onMessage(message);
  });
};
