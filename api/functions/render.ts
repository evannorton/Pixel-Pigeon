import { WorldEntity, WorldLevel, WorldTileset } from "../types/World";
import Sprite from "../classes/Sprite";
import assetsAreLoaded from "./assetsAreLoaded";
import drawImage from "./draw/drawImage";
import drawRectangle from "./draw/drawRectangle";
import drawText from "./draw/drawText";
import getCameraCoordinates, {
  CameraCoordinates,
} from "./getCameraCoordinates";
import getDefinables from "./getDefinables";
import getTotalAssets from "./getTotalAssets";
import state from "../state";

const render = (): void => {
  if (state.values.app === null) {
    throw new Error("An attempt was made to render before app was created.");
  }
  if (state.values.config === null) {
    throw new Error("An attempt was made to render before config was loaded.");
  }
  state.values.app.stage.removeChildren();
  drawRectangle(
    "#000000",
    1,
    0,
    0,
    state.values.config.width,
    state.values.config.height
  );
  if (!assetsAreLoaded()) {
    const current: number = state.values.loadedAssets;
    const total: number = getTotalAssets();
    const percent: number = current / total;
    const width: number = Math.floor(state.values.config.width * 0.625);
    const x: number = Math.floor((state.values.config.width - width) / 2);
    const height: number = 32;
    const y: number = Math.floor((state.values.config.height - height) / 2);
    drawRectangle("#343434", 1, x, y, width, height);
    drawRectangle("#7b7b7b", 1, x, y, Math.floor(width * percent), height);
  } else if (!state.values.hasInteracted) {
    drawText(
      "Click to focus",
      "#ffffff",
      Math.floor(state.values.config.width / 2),
      Math.floor(state.values.config.height / 2),
      1,
      state.values.config.width,
      1,
      "center",
      "middle"
    );
  } else {
    if (state.values.world === null) {
      throw new Error("An attempt was made to render before world was loaded.");
    }
    if (state.values.levelID !== null) {
      const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
      const level: WorldLevel | null =
        state.values.world.levels.get(state.values.levelID) ?? null;
      if (level === null) {
        throw Error("An attempt was made to render a nonexistent level.");
      }
      for (const layer of level.layers) {
        if (layer.tilesetID !== null) {
          const tileset: WorldTileset | null =
            state.values.world.tilesets.get(layer.tilesetID) ?? null;
          if (tileset === null) {
            throw Error("An attempt was made to render a nonexistent tileset.");
          }
          if (tileset.texture === null) {
            throw Error(
              "An attempt was made to render a tileset before its texture was loaded."
            );
          }
          for (const tile of layer.tiles) {
            drawImage(
              tileset.texture,
              1,
              tile.sourceX,
              tile.sourceY,
              tileset.tileSize,
              tileset.tileSize,
              tile.x - cameraCoordinates.x,
              tile.y - cameraCoordinates.y,
              layer.tileSize,
              layer.tileSize
            );
          }
        }
        for (const layerEntity of layer.entities) {
          const entity: WorldEntity | null =
            state.values.world.entities.get(layerEntity.id) ?? null;
          if (entity === null) {
            throw Error("An attempt was made to render a nonexistent entity.");
          }
          drawRectangle(
            entity.color,
            1,
            Math.round(layerEntity.x - cameraCoordinates.x),
            Math.round(layerEntity.y - cameraCoordinates.y),
            layerEntity.width,
            layerEntity.height
          );
        }
      }
    }
    getDefinables(Sprite).forEach((sprite: Sprite): void => {
      sprite.attemptDraw();
    });
  }
  state.values.app.stage.sortChildren();
  state.values.app.render();
};

export default render;
