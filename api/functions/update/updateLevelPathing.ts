import { Application } from "pixi.js";
import { js as EasyStar } from "easystarjs";
import { Level } from "../../types/World";
import { Pathing } from "../../types/Pathing";
import { TilePosition } from "../../types/TilePosition";
import { getEntityPathingMatrix } from "../getEntityPathingMatrix";
import { state } from "../../state";

export const updateLevelPathing = (): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to update level pathing before app was created.",
    );
  }
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
  const app: Application = state.values.app;
  for (const layer of level.layers) {
    for (const [, entity] of layer.entities) {
      const pathing: Pathing | null = entity.pathing;
      if (pathing !== null) {
        const startX: number = Math.floor(entity.position.x / layer.tileSize);
        const startY: number = Math.floor(entity.position.y / layer.tileSize);
        const endX: number = Math.floor(pathing.x / layer.tileSize);
        const endY: number = Math.floor(pathing.y / layer.tileSize);
        const matrix: number[][] = getEntityPathingMatrix(entity, []);
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
          (path: TilePosition[] | null): void => {
            entity.path = path;
            if (path !== null) {
              const nextTilePosition: TilePosition | undefined =
                path.length > 1
                  ? path[1]
                  : path.length === 1
                    ? path[0]
                    : {
                        x: startX,
                        y: startY,
                      };
              if (typeof nextTilePosition === "undefined") {
                throw new Error("Out of bounds path index");
              }
              if (
                entity.lastPathedTilePosition === null ||
                entity.lastPathedTilePosition.x !== nextTilePosition.x ||
                entity.lastPathedTilePosition.y !== nextTilePosition.y
              ) {
                entity.hasTouchedPathingStartingTile = false;
              }
              entity.lastPathedTilePosition = {
                x: nextTilePosition.x,
                y: nextTilePosition.y,
              };
              const nextTileX: number = entity.hasTouchedPathingStartingTile
                ? nextTilePosition.x * layer.tileSize
                : startX * layer.tileSize;
              const nextTileY: number = entity.hasTouchedPathingStartingTile
                ? nextTilePosition.y * layer.tileSize
                : startY * layer.tileSize;
              const step: number =
                pathing.velocity * (app.ticker.deltaMS / 1000);
              if (nextTileX > entity.position.x) {
                entity.position.x = Math.min(
                  entity.position.x + step,
                  nextTileX,
                );
              } else {
                entity.position.x = Math.max(
                  entity.position.x - step,
                  nextTileX,
                );
              }
              if (nextTileY > entity.position.y) {
                entity.position.y = Math.min(
                  entity.position.y + step,
                  nextTileY,
                );
              } else {
                entity.position.y = Math.max(
                  entity.position.y - step,
                  nextTileY,
                );
              }
              if (
                entity.position.x === nextTileX &&
                entity.position.y === nextTileY
              ) {
                entity.hasTouchedPathingStartingTile = true;
              }
            }
          },
        );
        easystar.calculate();
      }
    }
  }
};
