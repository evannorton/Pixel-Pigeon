export const onWindowMessage = (callback: (message: unknown) => void): void => {
  window.addEventListener("message", (message: unknown): void => {
    callback(message);
  });
};
