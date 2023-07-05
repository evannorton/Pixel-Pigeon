import { Assets } from "pixi.js";
import ImageSource from "../classes/ImageSource";
import getDefinables from "./getDefinables";
import state from "../state";

const loadAssets = (): void => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to load assets before world was loaded."
    );
  }
  Assets.load("./fonts/RetroPixels.fnt")
    .then((): void => {
      state.setValues({
        loadedAssets: state.values.loadedAssets + 1,
      });
    })
    .catch((error: Error): void => {
      throw error;
    });
  getDefinables(ImageSource).forEach((imageSource: ImageSource): void => {
    imageSource.loadTexture();
  });
};

export default loadAssets;
