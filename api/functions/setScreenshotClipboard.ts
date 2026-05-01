export const setScreenshotClipboard = (clipboard: boolean): void => {
  const copyScreenshotToggleInputElement: HTMLElement | null =
    document.getElementById("copy-screenshot-toggle-input");
  if (copyScreenshotToggleInputElement instanceof HTMLInputElement === false) {
    throw new Error(
      "An attempt was made to set screenshot clipboard with a copy screenshot toggle input element that is not an input element.",
    );
  }
  copyScreenshotToggleInputElement.checked = clipboard;
};
