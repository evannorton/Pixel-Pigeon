import { WorldLevel } from "../../types/World";
import state from "../../state";

const updateLevel = (): void => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to update level before world was loaded."
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to update level with no active level."
    );
  }
  const level: WorldLevel | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to update with a nonexistant active level.`
    );
  }
  for (const layer of level.layers) {
    for (const entity of layer.entities) {
      if (
        Math.abs(entity.lastX - entity.x) > Math.abs(entity.lastY - entity.y)
      ) {
        const x: number = Math.round(entity.x);
        const y: number = Math.round(
          entity.y + ((x - entity.x) * entity.velocityY) / entity.velocityX
        );
        entity.lastY = entity.y;
        entity.y = y;
      } else if (
        Math.abs(entity.lastX - entity.x) <= Math.abs(entity.lastY - entity.y)
      ) {
        const y: number = Math.round(entity.y);
        const x: number = Math.round(
          entity.x + ((y - entity.y) * entity.velocityX) / entity.velocityY
        );
        entity.lastX = entity.x;
        entity.x = x;
      }
      entity.velocityX = 0;
      entity.velocityY = 0;
    }
  }
};

export default updateLevel;
