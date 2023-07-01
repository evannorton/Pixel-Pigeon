import { WorldLevel } from "../../types/World";
import state from "../../state";

const updateLevel = (): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to update level before app was created."
    );
  }
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
      const unnormalizedEntityX: number =
        entity.x + entity.xVelocity * (state.values.app.ticker.deltaMS / 1000);
      const unnormalizedEntityY: number =
        entity.y + entity.yVelocity * (state.values.app.ticker.deltaMS / 1000);
      const nextX: number =
        entity.xVelocity > 0
          ? Math.ceil(unnormalizedEntityX)
          : Math.floor(unnormalizedEntityX);
      const nextY: number =
        entity.yVelocity > 0
          ? Math.ceil(unnormalizedEntityY)
          : Math.floor(unnormalizedEntityY);
      const xDistanceToNextX: number = Math.abs(nextX - unnormalizedEntityX);
      const yDistanceToNextY: number = Math.abs(nextY - unnormalizedEntityY);
      const averageDistanceToNext: number =
        (xDistanceToNextX + yDistanceToNextY) / 2;
      if (entity.xVelocity > 0) {
        entity.x = nextX - averageDistanceToNext;
      } else {
        entity.x = nextX + averageDistanceToNext;
      }
      if (entity.yVelocity > 0) {
        entity.y = nextY - averageDistanceToNext;
      } else {
        entity.y = nextY + averageDistanceToNext;
      }
    }
  }
};

export default updateLevel;
