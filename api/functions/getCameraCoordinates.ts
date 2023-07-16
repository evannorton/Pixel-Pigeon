import { WorldLevel } from "../types/World";
import state from "../state";

export interface CameraCoordinates {
  readonly x: number;
  readonly y: number;
}
const getCameraCoordinates = (): CameraCoordinates => {
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to get camera coordinates before config was loaded."
    );
  }
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to get camera coordinates before world was loaded."
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to get camera coordinates with no active level."
    );
  }
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to get camera coordinates with a nonexistant active level."
    );
  }
  if (state.values.cameraLockedEntityID !== null) {
    for (const layer of level.layers) {
      for (const entity of layer.entityInstances) {
        if (entity.entityID === state.values.cameraLockedEntityID) {
          return {
            x:
              Math.floor(entity.x) +
              Math.floor(entity.width / 2) -
              Math.floor(state.values.config.width / 2),
            y:
              Math.floor(entity.y) +
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

export default getCameraCoordinates;
