import { Entity } from "../classes/Entity";
import { Level } from "../types/World";
import { getDefinable } from "./getDefinable";
import { state } from "../state";

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
    const entity: Entity = getDefinable(
      Entity,
      state.values.cameraLockedEntityID,
    );
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
  return {
    x: 0,
    y: 0,
  };
};
