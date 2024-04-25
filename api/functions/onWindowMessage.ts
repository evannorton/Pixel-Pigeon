export const onWindowMessage = (callback: (message: unknown) => void): void => {
  window.addEventListener("message", (messageEvent: MessageEvent): void => {
    console.log("on message");
    console.log(messageEvent);
    callback(messageEvent.data);
  });
};
