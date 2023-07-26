import { Level } from "../types/World";
import { state } from "../state";

export interface EntityInstanceData {
  readonly x: number;
  readonly y: number;
}
export const getEntityInstanceData = (
  entityInstanceID: string,
): EntityInstanceData => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityInstanceID}" data before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to get entity "${entityInstanceID}" data with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to get entity "${entityInstanceID}" data with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [
      layerEntityInstanceID,
      entityInstance,
    ] of layer.entityInstances) {
      if (layerEntityInstanceID === entityInstanceID) {
        return {
          x: entityInstance.x,
          y: entityInstance.y,
        };
      }
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityInstanceID}" data for a nonexistant entity.`,
  );
};
