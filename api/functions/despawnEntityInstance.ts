import { Level } from "../types/World";
import { state } from "../state";

export const despawnEntityInstance = (entityInstanceID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityInstanceID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityInstanceID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityInstanceID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityInstanceID] of layer.entityInstances) {
      if (layerEntityInstanceID === entityInstanceID) {
        layer.entityInstances.delete(layerEntityInstanceID);
      }
    }
  }
};
