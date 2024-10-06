import { ImageSource } from "../classes/ImageSource";
import { getDefinables } from "definables";
import { handleUncaughtError } from "./handleUncaughtError";
import { loadPixiAsset } from "./loadPixiAsset";

export const loadAssets = (): void => {
  loadPixiAsset("fonts/RetroPixels.fnt").catch((error: unknown): void => {
    handleUncaughtError(error);
  });
  getDefinables(ImageSource).forEach((imageSource: ImageSource): void => {
    imageSource.loadTexture();
  });
};
