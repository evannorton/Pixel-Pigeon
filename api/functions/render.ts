import {
  CameraCoordinates,
  getCameraCoordinates,
} from "./getCameraCoordinates";
import { Label } from "../classes/Label";
import { Layer, Level, Tileset, World, WorldTilesetTile } from "../types/World";
import { Quadrilateral } from "../classes/Quadrilateral";
import { Sprite } from "../classes/Sprite";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { drawQuadrilateral } from "./draw/drawQuadrilateral";
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
  getDefinables(Quadrilateral).forEach((quadrilateral: Quadrilateral): void => {
    quadrilateral.clear();
  });
  state.values.app.stage.removeChildren();
  for (const child of state.values.renderChildrenToDestroy) {
    child.destroy();
  }
  state.setValues({ renderChildrenToDestroy: [] });
  drawQuadrilateral(
    "#000000",
    1,
    0,
    0,
    state.values.config.width,
    state.values.config.height,
    0,
  );
  if (!assetsAreLoaded()) {
    const current: number = state.values.loadedAssets;
    const total: number = getTotalAssets();
    const percent: number = current / total;
    const width: number = Math.floor(state.values.config.width * 0.625);
    const x: number = Math.floor((state.values.config.width - width) / 2);
    const height: number = 32;
    const y: number = Math.floor((state.values.config.height - height) / 2);
    drawQuadrilateral("#343434", 1, x, y, width, height, 0);
    drawQuadrilateral(
      "#7b7b7b",
      1,
      x,
      y,
      Math.floor(width * percent),
      height,
      0,
    );
  } else if (!state.values.hasInteracted) {
    drawText(
      "Click to focus",
      "#ffffff",
      Math.floor(state.values.config.width / 2),
      Math.floor(state.values.config.height / 2) - 3,
      1,
      state.values.config.width,
      1,
      "center",
      0,
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
      level.layers.forEach((layer: Layer, layerIndex: number): void => {
        if (state.values.config === null) {
          throw new Error(
            "An attempt was made to render before config was loaded.",
          );
        }
        if (state.values.app === null) {
          throw new Error(
            "An attempt was made to render before app was created.",
          );
        }
        if (layer.tilesetID !== null) {
          const tileset: Tileset | null =
            world.tilesets.get(layer.tilesetID) ?? null;
          if (tileset === null) {
            throw Error("An attempt was made to render a nonexistent tileset.");
          }
          for (const tile of layer.tiles) {
            const x: number = tile.x - cameraCoordinates.x;
            const y: number = tile.y - cameraCoordinates.y;
            const width: number = tileset.tileSize;
            const height: number = tileset.tileSize;
            if (
              x + width >= 0 &&
              y + height >= 0 &&
              x < state.values.config.width &&
              y < state.values.config.height
            ) {
              const matchedTile: WorldTilesetTile =
                tileset.tiles[
                  tile.tilesetX +
                    tile.tilesetY * (tileset.width / tileset.tileSize)
                ];
              tile.pixiSprite.texture = matchedTile.texture;
              tile.pixiSprite.x = x;
              tile.pixiSprite.y = y;
              tile.pixiSprite.width = width;
              tile.pixiSprite.height = height;
              tile.pixiSprite.alpha = 1;
              tile.pixiSprite.zIndex = layerIndex + 1 / (1 / Math.exp(0));
              state.values.app.stage.addChild(tile.pixiSprite);
            }
          }
        }
        for (const [, entity] of layer.entities) {
          for (const entitySprite of entity.sprites) {
            const sprite: Sprite = getDefinable(Sprite, entitySprite.spriteID);
            sprite.drawAtEntity(entity, entitySprite, layerIndex);
          }
          for (const entityQuadrilateral of entity.quadrilaterals) {
            const quadrilateral: Quadrilateral = getDefinable(
              Quadrilateral,
              entityQuadrilateral.quadrilateralID,
            );
            quadrilateral.drawAtEntity(entity, entityQuadrilateral, layerIndex);
          }
        }
      });
    }
    getDefinables(Quadrilateral).forEach(
      (quadrilateral: Quadrilateral): void => {
        quadrilateral.drawAtCoordinates();
      },
    );
    getDefinables(Sprite).forEach((sprite: Sprite): void => {
      sprite.drawAtCoordinates();
    });
    getDefinables(Label).forEach((label: Label): void => {
      label.drawAtCoordinates();
    });
  }
  state.values.app.stage.sortChildren();
  state.values.app.render();
};
