export const onWindowMessage = (callback: (message: unknown) => void): void => {
  window.addEventListener("message", (messageEvent: MessageEvent): void => {
    callback(messageEvent.data);
  });
};
