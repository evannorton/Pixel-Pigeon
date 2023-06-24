import { Assets } from "pixi.js";
import Level from "../classes/Level";
import OgmoProject from "../interfaces/ogmo/OgmoProject";
import Sprite from "../classes/Sprite";
import Tileset from "../classes/Tileset";
import getDefinables from "./getDefinables";
import state from "../state";

const load = (): void => {
  fetch("./project.ogmo")
    .then((res): void => {
      res
        .json()
        .then((ogmo: OgmoProject): void => {
          state.setValues({
            loadedAssets: state.values.loadedAssets + 1,
          });

          for (const ogmoTileset of ogmo.tilesets) {
            const trimmedPath = ogmoTileset.path.substring(7);
            const tileset = new Tileset({
              id: ogmoTileset.label.toLowerCase(),
              imagePath: trimmedPath.substring(0, trimmedPath.length - 4),
              tileHeight: ogmoTileset.tileHeight,
              tileWidth: ogmoTileset.tileWidth,
            });
            tileset.loadTexture();
          }

          Assets.load("./fonts/RetroPixels.fnt")
          .then((): void => {
            state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
          })
          .catch((e) => {
            throw e;
          });

          getDefinables(Sprite).forEach((sprite) => {
            sprite.loadTexture();
          });

          getDefinables(Level).forEach((level) => {
            level.loadOgmoLevel();
          });
        })
        .catch((e): void => {
          throw e;
        });
    })
    .catch((e) => {
      throw e;
    });
};

export default load; 