import { AStarFinder } from "astar-typescript";
import { Level } from "../../types/World";
import { getPathingMatrix } from "../getPathingMatrix";
import { state } from "../../state";

export const updateLevelPathing = (): void => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to update level pathing before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to update level pathing with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to update level pathing with a nonexistant active level.",
    );
  }
  for (const layer of level.layers) {
    for (const [, entity] of layer.entities) {
      entity.path = null;
      if (entity.position !== null && entity.pathing !== null) {
        const matrix: number[][] = getPathingMatrix();
        const finder: AStarFinder = new AStarFinder({
          diagonalAllowed: false,
          grid: {
            matrix,
          },
        });
        const startX: number = Math.floor(entity.position.x / layer.tileSize);
        const startY: number = Math.floor(entity.position.y / layer.tileSize);
        const endX: number = Math.floor(entity.pathing.x / 16);
        const endY: number = Math.floor(entity.pathing.y / 16);
        const path: number[][] = finder.findPath(
          {
            x: startX,
            y: startY,
          },
          {
            x: endX,
            y: endY,
          },
        );
        entity.path = path;
      }
    }
  }
};
