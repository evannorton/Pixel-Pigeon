import { js as EasyStar } from "easystarjs";
import { EntityPosition } from "../types/World";
import { PathingEntityExclusion } from "../types/PathingEntityExclusion";
import { PathingTileExclusion } from "../types/PathingTileExclusion";
import { TilePosition } from "../types/TilePosition";
import { getEntityPathingMatrix } from "./getEntityPathingMatrix";
import { state } from "../state";

export interface GetEntityCalculatedPathOptions {
  exclusions?: PathingEntityExclusion[];
  x: number;
  y: number;
}
export const getEntityCalculatedPath = (
  entityID: string,
  options: GetEntityCalculatedPathOptions,
): EntityPosition[] => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityID}" calculated path before world was loaded.`,
    );
  }
  let path: EntityPosition[] = [];
  for (const level of state.values.world.levels.values()) {
    for (const layer of level.layers) {
      for (const entity of layer.entities.values()) {
        if (entity.id === entityID) {
          const startX: number = Math.floor(entity.position.x / layer.tileSize);
          const startY: number = Math.floor(entity.position.y / layer.tileSize);
          const endX: number = Math.floor(options.x / layer.tileSize);
          const endY: number = Math.floor(options.y / layer.tileSize);
          const matrix: number[][] = getEntityPathingMatrix(
            entity,
            (options.exclusions ?? []).map(
              (exclusion: PathingEntityExclusion): PathingTileExclusion => ({
                tilePosition: {
                  x: Math.floor(exclusion.entityPosition.x / layer.tileSize),
                  y: Math.floor(exclusion.entityPosition.y / layer.tileSize),
                },
                type: exclusion.type,
              }),
            ),
          );
          const easystar: EasyStar = new EasyStar();
          easystar.setAcceptableTiles([0]);
          easystar.setGrid(matrix);
          easystar.enableDiagonals();
          easystar.disableCornerCutting();
          easystar.enableSync();
          easystar.findPath(
            startX,
            startY,
            endX,
            endY,
            (tilePath: TilePosition[] | null): void => {
              if (tilePath !== null) {
                path = tilePath.map(
                  (tilePosition: TilePosition): EntityPosition => ({
                    x: tilePosition.x * layer.tileSize,
                    y: tilePosition.y * layer.tileSize,
                  }),
                );
              }
            },
          );
          easystar.calculate();
          return path;
        }
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityID}" calculated path for a nonexistant entity.`,
  );
};
