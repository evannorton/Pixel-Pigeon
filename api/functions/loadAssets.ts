import { Assets, Texture } from "pixi.js";
import Sprite from "../classes/Sprite";
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
  getDefinables(Sprite).forEach((sprite: Sprite<string>): void => {
    sprite.loadTexture();
  });
  for (const tileset of state.values.world.tilesets.values()) {
    Assets.load(`./images/${tileset.imagePath}.png`)
      .then((texture: Texture): void => {
        tileset.texture = texture;
        state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
      })
      .catch((error: Error): void => {
        throw error;
      });
  }
};

export default loadAssets;
