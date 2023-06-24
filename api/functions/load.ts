import { Assets } from "pixi.js";
import Sprite from "../classes/Sprite";
import getDefinables from "./getDefinables";
import state from "../state";

const load = (): void => {
  Assets.load("./fonts/RetroPixels.fnt")
    .then((): void => {
      state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
    })
    .catch((error: Error): void => {
      throw error;
    });
  getDefinables(Sprite).forEach((sprite: Sprite): void => {
    sprite.loadTexture();
  });
};

export default load;
