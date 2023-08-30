import { Level } from "pigeon-mode-game-framework/api/types/World";
import { state } from "pigeon-mode-game-framework/api/state";

export interface CameraCoordinates {
  readonly x: number;
  readonly y: number;
}
export const getCameraCoordinates = (): CameraCoordinates => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get camera coordinates before config was loaded.",
    );
  }
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to get camera coordinates before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to get camera coordinates with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to get camera coordinates with a nonexistant active level.",
    );
  }
  if (state.values.cameraLockedEntityID !== null) {
    for (const layer of level.layers) {
      for (const [layerEntityID, entity] of layer.entities) {
        if (layerEntityID === state.values.cameraLockedEntityID) {
          if (entity.position === null) {
            throw new Error(
              "Attempted to lock camera to entity with no position.",
            );
          }
          return {
            x:
              Math.floor(entity.position.x) +
              Math.floor(entity.width / 2) -
              Math.floor(state.values.config.width / 2),
            y:
              Math.floor(entity.position.y) +
              Math.floor(entity.height / 2) -
              Math.floor(state.values.config.height / 2),
          };
        }
      }
    }
  }
  return {
    x: 0,
    y: 0,
  };
};
