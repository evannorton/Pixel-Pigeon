import { Entity, Level, Tileset, WorldTilesetTile } from "../types/World";
import { PathingTileExclusion } from "../types/PathingTileExclusion";
import { state } from "../state";

export const getEntityPathingMatrix = (
  entity: Entity,
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
        if (entity.collidesWithMap && matchedTile.isCollidable) {
          matrix[y][x] = 1;
        }
      }
    }
    for (const layerEntity of layer.entities.values()) {
      if (
        layerEntity.id !== entity.id &&
        layerEntity.type !== null &&
        entity.collidableEntityTypes.includes(layerEntity.type)
      ) {
        const unroundedX: number =
          layerEntity.blockingPosition?.x ?? layerEntity.position.x;
        const unroundedY: number =
          layerEntity.blockingPosition?.y ?? layerEntity.position.y;
        const positions: [number, number][] = [
          // Top left
          [
            Math.floor(unroundedX / layer.tileSize),
            Math.floor(unroundedY / layer.tileSize),
          ],
          // Top right
          [
            Math.floor((unroundedX + entity.width - 1) / layer.tileSize),
            Math.floor(unroundedY / layer.tileSize),
          ],
          // Bottom left
          [
            Math.floor(unroundedX / layer.tileSize),
            Math.floor((unroundedY + entity.height - 1) / layer.tileSize),
          ],
          // Bottom right
          [
            Math.floor((unroundedX + entity.width - 1) / layer.tileSize),
            Math.floor((unroundedY + entity.height - 1) / layer.tileSize),
          ],
        ];
        const filteredPositions: [number, number][] = [];
        for (const [x, y] of positions) {
          if (
            !filteredPositions.some(
              ([filteredX, filteredY]: [number, number]): boolean =>
                filteredX === x && filteredY === y,
            )
          ) {
            filteredPositions.push([x, y]);
          }
        }
        for (const [x, y] of filteredPositions) {
          if (typeof matrix[y] === "undefined") {
            matrix[y] = [];
          }
          if (
            exclusions.some(
              (exclusion: PathingTileExclusion): boolean =>
                exclusion.type === layerEntity.type &&
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
  }
  return matrix;
};
