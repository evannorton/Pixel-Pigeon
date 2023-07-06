import ImageSource from "../classes/ImageSource";
import getDefinables from "./getDefinables";
import loadPixiAsset from "./loadPixiAsset";

const loadAssets = (): void => {
  loadPixiAsset("fonts/RetroPixels.fnt");
  getDefinables(ImageSource).forEach((imageSource: ImageSource): void => {
    imageSource.loadTexture();
  });
};

export default loadAssets;
