import { ImageSource } from "../classes/ImageSource";
import { getDefinables } from "./getDefinables";
import { loadPixiAsset } from "./loadPixiAsset";

export const loadAssets = (): void => {
  loadPixiAsset("fonts/RetroPixels.fnt").catch((error: unknown): void => {
    throw error;
  });
  getDefinables(ImageSource).forEach((imageSource: ImageSource): void => {
    imageSource.loadTexture();
  });
};
