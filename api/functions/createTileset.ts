import { ImageSource } from "../classes/ImageSource";
import { Rectangle, Texture } from "pixi.js";
import {
  WorldTilesetTile,
  WorldTilesetTileAnimationFrame,
} from "../types/World";
import { getDefinable } from "./getDefinable";
import { state } from "../state";

export interface CreateTilesetOptionsTileAnimation {
  duration: number;
  tilesetX: number;
  tilesetY: number;
}
export interface CreateTilesetOptionsTile {
  animations?: CreateTilesetOptionsTileAnimation[];
  isCollidable: boolean;
  tilesetX: number;
  tilesetY: number;
}
export interface CreateTilesetOptions {
  height: number;
  id: string;
  imagePath: string;
  padding?: number;
  tileSize: number;
  tiles: CreateTilesetOptionsTile[];
  width: number;
  xSpacing?: number;
  ySpacing?: number;
}
export const createTileset = (options: CreateTilesetOptions): void => {
  if (state.values.world === null) {
    throw new Error("Attempted to create Tileset without a world");
  }
  if (state.values.world.tilesets.has(options.id)) {
    throw new Error(`Tileset with id "${options.id}" already exists.`);
  }
  const padding: number = options.padding ?? 0;
  const xSpacing: number = options.xSpacing ?? 0;
  const ySpacing: number = options.ySpacing ?? 0;
  state.values.world.tilesets.set(options.id, {
    height: options.height,
    imageSourceID: options.imagePath,
    tileSize: options.tileSize,
    tiles: [...options.tiles]
      .sort(
        (
          tileA: CreateTilesetOptionsTile,
          tileB: CreateTilesetOptionsTile,
        ): number => {
          const indexA: number =
            tileA.tilesetX +
            tileA.tilesetY * (options.width / options.tileSize);
          const indexB: number =
            tileB.tilesetX +
            tileB.tilesetY * (options.width / options.tileSize);
          return indexA - indexB;
        },
      )
      .map(
        (tile: CreateTilesetOptionsTile): WorldTilesetTile => ({
          animationFrames:
            tile.animations?.map(
              (
                animation: CreateTilesetOptionsTileAnimation,
              ): WorldTilesetTileAnimationFrame => ({
                duration: animation.duration,
                texture: new Texture(
                  getDefinable(
                    ImageSource,
                    options.imagePath,
                  ).texture.baseTexture,
                  new Rectangle(
                    animation.tilesetX * options.tileSize + xSpacing + padding,
                    animation.tilesetY * options.tileSize + ySpacing + padding,
                    options.tileSize,
                    options.tileSize,
                  ),
                ),
              }),
            ) ?? [],
          isCollidable: tile.isCollidable,
          texture: new Texture(
            getDefinable(ImageSource, options.imagePath).texture.baseTexture,
            new Rectangle(
              tile.tilesetX * options.tileSize + xSpacing + padding,
              tile.tilesetY * options.tileSize + ySpacing + padding,
              options.tileSize,
              options.tileSize,
            ),
          ),
        }),
      ),
    width: options.width,
  });
};
