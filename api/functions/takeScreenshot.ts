import { ICanvas, ICanvasRenderingContext2D, Rectangle } from "pixi.js";
import { state } from "../state";
import { toast } from "../constants/toasts";

export const takeScreenshot = (): void => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to take screenshot before config was loaded.",
    );
  }
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to take screenshot before app was created.",
    );
  }
  const copyScreenshotToggleInputElement: HTMLElement | null =
    document.getElementById("copy-screenshot-toggle-input");
  if (copyScreenshotToggleInputElement === null) {
    throw new Error(
      "An attempt was made to take screenshot with no copy schreenshot toggle input element.",
    );
  }
  const scaleScreenshotInputElement: HTMLElement | null =
    document.getElementById("scale-screenshot-input");
  if (scaleScreenshotInputElement === null) {
    throw new Error(
      "An attempt was made to take screenshot with no scale screenshot input element.",
    );
  }
  if (
    copyScreenshotToggleInputElement instanceof HTMLInputElement &&
    scaleScreenshotInputElement instanceof HTMLInputElement
  ) {
    if (typeof navigator.clipboard === "undefined") {
      toast.error("Failed to take screenshot");
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
        toast.error("Failed to take a screenshot");
      } else {
        const scale: number = Number(scaleScreenshotInputElement.value);
        const context: ICanvasRenderingContext2D | null =
          canvas.getContext("2d");
        if (context !== null) {
          const imageData: ImageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          canvas.width *= scale;
          canvas.height *= scale;
          context.putImageData(imageData, 0, 0);
          context.scale(scale, scale);
          context.imageSmoothingEnabled = false;
          context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        }
        if (copyScreenshotToggleInputElement.checked === false) {
          const anchor: HTMLAnchorElement = document.createElement("a");
          anchor.download = `${state.values.config.name} screenshot.png`;
          anchor.href = canvas.toDataURL();
          anchor.click();
          toast.success("Screenshot saved");
        } else {
          canvas.toBlob((blob: Blob | null): void => {
            if (blob !== null) {
              navigator.clipboard
                .write([new ClipboardItem({ "image/png": blob })])
                .then((): void => {
                  toast.success("Screenshot copied to clipboard");
                })
                .catch((): void => {
                  toast.error("Failed to copy screenshot to clipboard");
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
