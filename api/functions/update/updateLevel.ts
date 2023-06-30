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
      entity.x += entity.velocityX * (state.values.app.ticker.deltaMS / 1000);
      entity.y += entity.velocityY * (state.values.app.ticker.deltaMS / 1000);
      entity.velocityX = 0;
      entity.velocityY = 0;
    }
  }
};

export default updateLevel;
