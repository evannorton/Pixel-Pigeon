import { EntityInstance, Level } from "../types/World";
import { state } from "../state";

interface MoveEntityInstanceOptions {
  readonly xVelocity?: number;
  readonly yVelocity?: number;
}

export const moveEntityInstance = (
  entityInstanceID: string,
  options: MoveEntityInstanceOptions,
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
    const entity: EntityInstance | null =
      layer.entityInstances.find(
        (layerEntity: EntityInstance): boolean =>
          layerEntity.id === entityInstanceID,
      ) ?? null;
    if (entity !== null) {
      if (typeof options.xVelocity !== "undefined") {
        entity.xVelocity += options.xVelocity;
      }
      if (typeof options.yVelocity !== "undefined") {
        entity.yVelocity += options.yVelocity;
      }
    }
  }
};
