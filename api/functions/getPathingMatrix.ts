import { Level, Tileset, WorldTilesetTile } from "../types/World";
import { state } from "../state";

export const getPathingMatrix = (collisionLayers: string[]): number[][] => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to get pathing matrix before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to get pathing matrix with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to get pathing matrix with a nonexistant active level.",
    );
  }
  const matrix: number[][] = [];
  for (const layer of level.layers) {
    if (layer.tilesetID !== null) {
      const tileset: Tileset | null =
        state.values.world.tilesets.get(layer.tilesetID) ?? null;
      if (tileset === null) {
        throw Error(
          "An attempt was made to get pathing matrix for a nonexistent tileset.",
        );
      }
      for (const layerTile of layer.tiles) {
        const matchedTile: WorldTilesetTile | null =
          tileset.tiles.find(
            (tile: WorldTilesetTile): boolean => layerTile.id === tile.id,
          ) ?? null;
        const x: number = layerTile.x / layer.tileSize;
        const y: number = layerTile.y / layer.tileSize;
        if (typeof matrix[y] === "undefined") {
          matrix[y] = [];
        }
        if (typeof matrix[y][x] === "undefined") {
          matrix[y][x] = 0;
        }
        if (matchedTile !== null && matchedTile.isCollidable) {
          matrix[y][x] = 1;
        }
      }
    }
    for (const entity of layer.entities.values()) {
      if (
        entity.collisionLayer !== null &&
        collisionLayers.includes(entity.collisionLayer)
      ) {
        const x: number = entity.position.x / layer.tileSize;
        const y: number = entity.position.y / layer.tileSize;
        if (typeof matrix[y] === "undefined") {
          matrix[y] = [];
        }
        matrix[y][x] = 1;
      }
    }
  }
  return matrix;
};
