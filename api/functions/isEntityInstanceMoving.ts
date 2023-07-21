import { EntityInstance, Level } from "../types/World";
import { state } from "../state";

export const isEntityInstanceMoving = (entityInstanceID: string): boolean => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to check movement of entity instance "${entityInstanceID}" before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to check movement of entity instance "${entityInstanceID}" with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to check movement of entity instance "${entityInstanceID}" with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    const entity: EntityInstance | null =
      layer.entityInstances.find(
        (layerEntity: EntityInstance): boolean =>
          layerEntity.id === entityInstanceID,
      ) ?? null;
    if (entity !== null) {
      return entity.xVelocity !== 0 || entity.yVelocity !== 0;
    }
  }
  return false;
};
