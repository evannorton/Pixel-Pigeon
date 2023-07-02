import { WorldLevel, WorldTileset, WorldTilesetTile } from "../types/World";
import rectanglesOverlap from "./rectanglesOverlap";
import state from "../state";

const rectangleContainsCollision = (
  x: number,
  y: number,
  width: number,
  height: number
): boolean => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to check box collision before world was loaded."
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to check box collision with no active level."
    );
  }
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to check box collision a nonexistant active level."
    );
  }
  for (const layer of level.layers) {
    if (layer.tilesetID !== null) {
      const tileset: WorldTileset | null =
        state.values.world.tilesets.get(layer.tilesetID) ?? null;
      if (tileset === null) {
        throw Error("An attempt was made to render a nonexistent tileset.");
      }
      for (const layerTile of layer.tiles) {
        const matchedTile: WorldTilesetTile | null =
          tileset.tiles.find(
            (tile: WorldTilesetTile): boolean => layerTile.id === tile.id
          ) ?? null;
        if (matchedTile !== null && matchedTile.isCollidable) {
          if (
            rectanglesOverlap(
              {
                height,
                width,
                x,
                y,
              },
              {
                height: tileset.tileSize,
                width: tileset.tileSize,
                x: layerTile.x,
                y: layerTile.y,
              }
            )
          ) {
            return true;
          }
        }
      }
    }
  }
  console.log(`${x} ${y} ${width} ${height}`);
  return false;
};

export default rectangleContainsCollision;
