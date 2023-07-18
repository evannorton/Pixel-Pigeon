import {
  WorldLevel,
  WorldLevelLayerEntity,
} from "pigeon-mode-game-framework/api/types/World";
import state from "pigeon-mode-game-framework/api/state";

interface EntityInstanceData {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}
const getEntityInstanceData = (
  entityInstanceID: string
): EntityInstanceData => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to get entity "${entityInstanceID}" data before world was loaded.`
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to get entity "${entityInstanceID}" data with no active level.`
    );
  }
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to get entity "${entityInstanceID}" data with a nonexistant active level.`
    );
  }
  for (const layer of level.layers) {
    const entity: WorldLevelLayerEntity | null =
      layer.entityInstances.find(
        (layerEntity: WorldLevelLayerEntity): boolean =>
          layerEntity.id === entityInstanceID
      ) ?? null;
    if (entity !== null) {
      return {
        height: entity.height,
        width: entity.width,
        x: entity.x,
        y: entity.y,
      };
    }
  }
  throw new Error(
    `An attempt was made to get entity "${entityInstanceID}" data for a nonexistant entity.`
  );
};

export default getEntityInstanceData;
export { EntityInstanceData };
