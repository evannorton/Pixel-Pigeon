import {
  CameraCoordinates,
  getCameraCoordinates,
} from "./getCameraCoordinates";
import { Entity, Level, Tileset } from "../types/World";
import { ImageSource } from "../classes/ImageSource";
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
    if (state.values.levelID !== null) {
      const cameraCoordinates: CameraCoordinates = getCameraCoordinates();
      const level: Level | null =
        state.values.world.levels.get(state.values.levelID) ?? null;
      if (level === null) {
        throw Error("An attempt was made to render a nonexistent level.");
      }
      for (const layer of level.layers) {
        if (layer.tilesetID !== null) {
          const tileset: Tileset | null =
            state.values.world.tilesets.get(layer.tilesetID) ?? null;
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
            );
          }
        }
        for (const [, entityInstance] of layer.entityInstances) {
          const entity: Entity | null =
            state.values.world.entities.get(entityInstance.entityID) ?? null;
          if (entity === null) {
            throw Error("An attempt was made to render a nonexistent entity.");
          }
          if (entityInstance.spriteInstanceID !== null) {
            const spriteInstance: SpriteInstance<string> = getDefinable<
              SpriteInstance<string>
            >(SpriteInstance, entityInstance.spriteInstanceID);
            spriteInstance.drawAtEntityInstance(entityInstance);
          } else {
            drawRectangle(
              entity.color,
              1,
              Math.floor(entityInstance.x) - cameraCoordinates.x,
              Math.floor(entityInstance.y) - cameraCoordinates.y,
              entityInstance.width,
              entityInstance.height,
            );
          }
        }
      }
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
