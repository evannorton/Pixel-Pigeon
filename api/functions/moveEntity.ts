import { WorldLayerEntity, WorldLevel } from "../types/World";
import state from "../state";

const moveEntity = (
  entityID: string,
  velocityX: number,
  velocityY: number
): void => {
  if (state.values.app === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" before app was created.`
    );
  }
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
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to move entity "${entityID}" with a nonexistant active level.`
    );
  }
  for (const layer of level.layers) {
    const entity: WorldLayerEntity | null =
      layer.entities.find(
        (layerEntity: WorldLayerEntity): boolean => layerEntity.id === entityID
      ) ?? null;
    if (entity !== null) {
      const newX: number =
        entity.x + velocityX * (state.values.app.ticker.deltaMS / 1000);
      const newY: number =
        entity.y + velocityY * (state.values.app.ticker.deltaMS / 1000);
      entity.x = newX;
      entity.y = newY;
    }
  }
};

export default moveEntity;
