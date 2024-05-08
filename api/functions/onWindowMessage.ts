export const onWindowMessage = (callback: (message: unknown) => void): void => {
  window.addEventListener("message", (messageEvent: MessageEvent): void => {
    if (messageEvent.source === window.parent) {
      callback(messageEvent.data);
    }
  });
};
