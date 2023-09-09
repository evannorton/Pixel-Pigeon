import {
  CameraCoordinates,
  getCameraCoordinates,
} from "./getCameraCoordinates";
import { ImageSource } from "../classes/ImageSource";
import { Layer, Level, Tileset, World } from "../types/World";
import { SpriteInstance } from "../classes/SpriteInstance";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { drawImage } from "./draw/drawImage";
import { drawRectangle } from "./draw/drawRectangle";
import { drawText } from "./draw/drawText";
import { getDefinable } from "./getDefinable";
import { getDefinables } from "./getDefinables";
import { getTotalAssets } from "./getTotalAssets";
import { state } from "../state";

export const render = (): void => {
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
    state.values.config.height,
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
      "middle",
    );
  } else {
    if (state.values.world === null) {
      throw new Error("An attempt was made to render before world was loaded.");
    }
    const world: World = state.values.world;
    if (state.values.levelID !== null) {
      const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
      const level: Level | null =
        world.levels.get(state.values.levelID) ?? null;
      if (level === null) {
        throw Error("An attempt was made to render a nonexistent level.");
      }
      level.layers.forEach((layer: Layer<string>, layerIndex: number): void => {
        if (layer.tilesetID !== null) {
          const tileset: Tileset | null =
            world.tilesets.get(layer.tilesetID) ?? null;
          if (tileset === null) {
            throw Error("An attempt was made to render a nonexistent tileset.");
          }
          for (const tile of layer.tiles) {
            const sourceX: number =
              (tile.id * tileset.tileSize) % tileset.width;
            const sourceY: number =
              Math.floor((tile.id * tileset.tileSize) / tileset.width) *
              tileset.tileSize;
            drawImage(
              getDefinable(ImageSource, tileset.imageSourceID).texture,
              1,
              sourceX,
              sourceY,
              tileset.tileSize,
              tileset.tileSize,
              tile.x - cameraCoordinates.x,
              tile.y - cameraCoordinates.y,
              layer.tileSize,
              layer.tileSize,
              layerIndex + 1 / (1 + Math.exp(0)),
            );
          }
        }
        for (const [, entity] of layer.entities) {
          if (entity.spriteInstanceID !== null) {
            const spriteInstance: SpriteInstance<string> = getDefinable<
              SpriteInstance<string>
            >(SpriteInstance, entity.spriteInstanceID);
            spriteInstance.drawAtEntity(entity, layerIndex);
          }
        }
      });
    }
    getDefinables(SpriteInstance).forEach(
      (spriteInstance: SpriteInstance<string>): void => {
        spriteInstance.drawAtCoordinates();
      },
    );
  }
  state.values.app.stage.sortChildren();
  state.values.app.render();
};
