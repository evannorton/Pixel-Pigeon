import { Level } from "../types/World";
import { state } from "../state";

interface StopEntityInstanceOptions {
  readonly x?: boolean;
  readonly y?: boolean;
}

export const stopEntityInstance = (
  entityInstanceID: string,
  options: StopEntityInstanceOptions,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to move entity "${entityInstanceID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to move entity "${entityInstanceID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to move entity "${entityInstanceID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [
      layerEntityInstanceID,
      entityInstance,
    ] of layer.entityInstances) {
      if (layerEntityInstanceID === entityInstanceID) {
        if (typeof options.x !== "undefined" && options.x) {
          entityInstance.xVelocity = 0;
        }
        if (typeof options.y !== "undefined" && options.y) {
          entityInstance.yVelocity = 0;
        }
      }
    }
  }
};
