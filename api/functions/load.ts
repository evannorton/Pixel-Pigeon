import { Assets } from "pixi.js";
import Entity from "../classes/Entity";
import Level from "../classes/Level";
import OgmoProject from "../types/ogmo/OgmoProject";
import Sprite from "../classes/Sprite";
import Tileset from "../classes/Tileset";
import getDefinables from "./getDefinables";
import state from "../state";

const load = (): void => {
  fetch("./project.ogmo")
    .then((response: Response): void => {
      response
        .json()
        .then((ogmoProject: OgmoProject): void => {
          state.setValues({
            loadedAssets: state.values.loadedAssets + 1,
          });
          for (const ogmoTileset of ogmoProject.tilesets) {
            const trimmedPath: string = ogmoTileset.path.substring(7);
            const tileset: Tileset = new Tileset({
              id: ogmoTileset.label.toLowerCase(),
              imagePath: trimmedPath.substring(0, trimmedPath.length - 4),
              tileHeight: ogmoTileset.tileHeight,
              tileWidth: ogmoTileset.tileWidth,
            });
            tileset.loadTexture();
          }
          ogmoProject.entities.forEach(
            (
              ogmoEntity: OgmoProject["entities"][0],
              ogmoEntityIndex: number
            ): void => {
              new Entity({
                color: String(ogmoEntity.color.substring(0, 7)),
                height: ogmoEntity.size.y,
                id: String(ogmoEntityIndex),
                width: ogmoEntity.size.x,
              });
            }
          );
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
          getDefinables(Level).forEach((level: Level): void => {
            level.loadOgmoLevel();
          });
        })
        .catch((error: Error): void => {
          throw error;
        });
    })
    .catch((error: Error): void => {
      throw error;
    });
};

export default load;
