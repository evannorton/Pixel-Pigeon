import {
  Level,
  EntityInstance,
} from "../types/World";
import { state } from "../state";

interface StopEntityInstanceOptions {
  readonly x?: boolean;
  readonly y?: boolean;
}
export const stopEntityInstance = (
  entityID: string,
  options: StopEntityInstanceOptions
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" before world was loaded.`
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" with no active level.`
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" with a nonexistant active level.`
    );
  }
  for (const layer of level.layers) {
    const entity: EntityInstance | null =
      layer.entityInstances.find(
        (layerEntity: EntityInstance): boolean =>
          layerEntity.id === entityID
      ) ?? null;
    if (entity !== null) {
      if (typeof options.x !== "undefined" && options.x) {
        entity.xVelocity = 0;
      }
      if (typeof options.y !== "undefined" && options.y) {
        entity.yVelocity = 0;
      }
    }
  }
};
