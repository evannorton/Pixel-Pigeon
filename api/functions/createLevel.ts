import { Layer } from "../types/World";
import { Sprite } from "pixi.js";
import { createTileHalfResolutionDoublingPixiResources } from "./createTileHalfResolutionDoublingPixiResources";
import { state } from "../state";

export interface CreateLevelOptionsLayerTile {
  tilesetID: string;
  tilesetX: number;
  tilesetY: number;
  x: number;
  y: number;
}
export interface CreateLevelOptionsLayer {
  id: string;
  tiles: CreateLevelOptionsLayerTile[];
}
export interface CreateLevelOptions {
  height: number;
  id: string;
  layers: CreateLevelOptionsLayer[];
  tileSize: number;
  width: number;
}
export const createLevel = (options: CreateLevelOptions): void => {
  if (state.values.world === null) {
    throw new Error("Attempted to create Level without a world");
  }
  if (state.values.world.levels.has(options.id)) {
    throw new Error(`Level with id "${options.id}" already exists.`);
  }
  state.values.world.levels.set(options.id, {
    height: options.height,
    id: options.id,
    layers: options.layers.map(
      (layer: CreateLevelOptionsLayer): Layer => ({
        entityIDs: [],
        id: layer.id,
        tileSize: options.tileSize,
        tiles: layer.tiles.map(
          (tile: CreateLevelOptionsLayerTile): Layer["tiles"][0] => {
            if (state.values.tilemapDownsampleScale === 1) {
              return {
                pixiSprite: new Sprite(),
                tileDoubledDisplayPixiSprite: null,
                tileHalfResolutionRenderTexture: null,
                tilesetID: tile.tilesetID,
                tilesetX: tile.tilesetX,
                tilesetY: tile.tilesetY,
                x: tile.x,
                y: tile.y,
              };
            }
            const tileHalfResolutionDoublingPixiResources: ReturnType<
              typeof createTileHalfResolutionDoublingPixiResources
            > = createTileHalfResolutionDoublingPixiResources(
              options.tileSize,
              state.values.tilemapDownsampleScale,
            );
            return {
              pixiSprite: new Sprite(),
              tileDoubledDisplayPixiSprite:
                tileHalfResolutionDoublingPixiResources.tileDoubledDisplayPixiSprite,
              tileHalfResolutionRenderTexture:
                tileHalfResolutionDoublingPixiResources.tileHalfResolutionRenderTexture,
              tilesetID: tile.tilesetID,
              tilesetX: tile.tilesetX,
              tilesetY: tile.tilesetY,
              x: tile.x,
              y: tile.y,
            };
          },
        ),
      }),
    ),
    width: options.width,
  });
};
