import { WorldLayerEntity, WorldLevel } from "../types/World";
import Axis from "../types/Axis";
import state from "../state";

const moveEntity = (entityID: string, axis: Axis, velocity: number): void => {
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
      switch (axis) {
        case Axis.X:
          entity.velocityX = velocity;
          break;
        case Axis.Y:
          entity.velocityY = velocity;
          break;
      }
    }
  }
};

export default moveEntity;
