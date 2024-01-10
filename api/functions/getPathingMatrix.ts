import { Level, Tileset, WorldTilesetTile } from "../types/World";
import { PathingTileExclusion } from "../types/PathingTileExclusion";
import { state } from "../state";

export const getPathingMatrix = (
  types: string[],
  exclusions: PathingTileExclusion[],
): number[][] => {
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
        const matchedTile: WorldTilesetTile =
          tileset.tiles[
            layerTile.tilesetX +
              layerTile.tilesetY * (tileset.width / tileset.tileSize)
          ];
        const x: number = Math.floor(layerTile.x / layer.tileSize);
        const y: number = Math.floor(layerTile.y / layer.tileSize);
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
      if (entity.type !== null && types.includes(entity.type)) {
        const blockingX: number | null =
          entity.blockingPosition !== null
            ? Math.floor(entity.blockingPosition.x / layer.tileSize)
            : null;
        const blockingY: number | null =
          entity.blockingPosition !== null
            ? Math.floor(entity.blockingPosition.y / layer.tileSize)
            : null;
        const x: number =
          blockingX !== null
            ? blockingX
            : Math.floor(entity.position.x / layer.tileSize);
        const y: number =
          blockingY !== null
            ? blockingY
            : Math.floor(entity.position.y / layer.tileSize);
        if (typeof matrix[y] === "undefined") {
          matrix[y] = [];
        }
        if (
          exclusions.some(
            (exclusion: PathingTileExclusion): boolean =>
              exclusion.type === entity.type &&
              exclusion.tilePosition.x === x &&
              exclusion.tilePosition.y === y,
          )
        ) {
          matrix[y][x] = 0;
        } else {
          matrix[y][x] = 1;
        }
      }
    }
  }
  return matrix;
};
