import { state } from "../../state";

export interface ListenToSocketioEventOptions {
  eventName: string;
  onMessage: (message: unknown) => void;
}
export const listenToSocketioEvent = (
  options: ListenToSocketioEventOptions,
): void => {
  if (state.values.socket === null) {
    throw new Error("Attempted to listen to socket.io event with no socket.");
  }
  state.values.socket.on(options.eventName, (message: unknown): void => {
    options.onMessage(message);
  });
};
