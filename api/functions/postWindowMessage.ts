export const postWindowMessage = (message: unknown): void => {
  parent.postMessage(message, "*");
};
