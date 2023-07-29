import { Level } from "pigeon-mode-game-framework/api/types/World";
import { state } from "pigeon-mode-game-framework/api/state";

export const despawnEntity = (entityID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to despawn entity instance "${entityID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID] of layer.entities) {
      if (layerEntityID === entityID) {
        layer.entities.delete(layerEntityID);
      }
    }
  }
};
