import { WorldLayerEntity, WorldLevel } from "../types/World";
import state from "../state";

interface MoveEntityOptions {
  readonly entityID: string;
  readonly xVelocity?: number;
  readonly yVelocity?: number;
}
const moveEntity = (options: MoveEntityOptions): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to move entity "${options.entityID}" before world was loaded.`
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to move entity "${options.entityID}" with no active level.`
    );
  }
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to move entity "${options.entityID}" with a nonexistant active level.`
    );
  }
  for (const layer of level.layers) {
    const entity: WorldLayerEntity | null =
      layer.entities.find(
        (layerEntity: WorldLayerEntity): boolean =>
          layerEntity.id === options.entityID
      ) ?? null;
    if (entity !== null) {
      if (typeof options.xVelocity !== "undefined") {
        entity.xVelocity = options.xVelocity;
      }
      if (typeof options.yVelocity !== "undefined") {
        entity.yVelocity = options.yVelocity;
      }
    }
  }
};

export default moveEntity;
