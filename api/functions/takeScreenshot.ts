import { ICanvas, Rectangle } from "pixi.js";
import { state } from "../state";

export const takeScreenshot = (): void => {
  if (state.values.config === null) {
    throw new Error("Attempted to take screenshot before config was loaded.");
  }
  if (state.values.app === null) {
    throw new Error("Attempted to take screenshot before app was created.");
  }
  const copyScreenshotToggleInputElement: HTMLElement | null =
    document.getElementById("copy-screenshot-toggle-input");
  if (copyScreenshotToggleInputElement instanceof HTMLInputElement) {
    if (typeof navigator.clipboard === "undefined") {
      // TODO error toast
    } else {
      const canvas: ICanvas = state.values.app.renderer.extract.canvas(
        state.values.app.stage,
        new Rectangle(
          0,
          0,
          state.values.config.width,
          state.values.config.height,
        ),
      );
      if (
        typeof canvas.toDataURL === "undefined" ||
        typeof canvas.toBlob === "undefined"
      ) {
        // TODO error toast
      } else {
        if (copyScreenshotToggleInputElement.checked === false) {
          const anchor: HTMLAnchorElement = document.createElement("a");
          anchor.download = `${state.values.config.name} screenshot.png`;
          anchor.href = canvas.toDataURL();
          anchor.click();
          // TODO success toast
        } else {
          canvas.toBlob((blob: Blob | null): void => {
            if (blob !== null) {
              navigator.clipboard
                .write([new ClipboardItem({ "image/png": blob })])
                .then((): void => {
                  // TODO success toast
                })
                .catch((): void => {
                  // TODO error toast
                });
            }
          });
        }
      }
    }
  } else {
    throw new Error(
      "An attempt was made to take screenshot with a copy screenshot toggle input element that is not an input element.",
    );
  }
};
