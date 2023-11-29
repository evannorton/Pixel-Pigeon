import { Entity, Layer, Level } from "../types/World";
import { state } from "../state";

export const setEntityLevel = (entityID: string, levelID: string): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" level before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" level with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" level with a nonexistant active level.`,
    );
  }
  const newLevel: Level | null = state.values.world.levels.get(levelID) ?? null;
  if (newLevel === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" level with nonexistant level "${levelID}".`,
    );
  }
  for (const layer of level.layers) {
    const matchedEntity: [string, Entity] | null =
      Array.from(layer.entities).find(
        (layerEntity: [string, Entity]): boolean => layerEntity[0] === entityID,
      ) ?? null;
    if (matchedEntity !== null) {
      const entity: Entity | null =
        layer.entities.get(matchedEntity[0]) ?? null;
      if (entity !== null) {
        const newLayer: Layer | null =
          newLevel.layers.find(
            (newLevelLayer: Layer): boolean => newLevelLayer.id === layer.id,
          ) ?? null;
        if (newLayer !== null) {
          newLayer.entities.set(matchedEntity[0], entity);
          layer.entities.delete(matchedEntity[0]);
        }
      }
    }
  }
};
