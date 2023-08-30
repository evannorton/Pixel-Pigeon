import { ImageSource } from "pigeon-mode-game-framework/api/classes/ImageSource";
import { getDefinables } from "pigeon-mode-game-framework/api/functions/getDefinables";
import { loadPixiAsset } from "pigeon-mode-game-framework/api/functions/loadPixiAsset";

export const loadAssets = (): void => {
  loadPixiAsset("fonts/RetroPixels.fnt").catch((error: Error): void => {
    throw error;
  });
  getDefinables(ImageSource).forEach((imageSource: ImageSource): void => {
    imageSource.loadTexture();
  });
};
