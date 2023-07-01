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
      if (entity.xVelocity !== 0 || entity.yVelocity !== 0) {
        const unnormalizedEntityX: number =
          entity.x +
          entity.xVelocity * (state.values.app.ticker.deltaMS / 1000);
        const unnormalizedEntityY: number =
          entity.y +
          entity.yVelocity * (state.values.app.ticker.deltaMS / 1000);
        const isXLarger: boolean =
          Math.abs(entity.xVelocity) >= Math.abs(entity.yVelocity);
        const largerVelocity: number = isXLarger
          ? entity.xVelocity
          : entity.yVelocity;
        const smallerVelocity: number = !isXLarger
          ? entity.xVelocity
          : entity.yVelocity;
        const largerStart: number = isXLarger ? entity.x : entity.y;
        const largerEnd: number = isXLarger
          ? unnormalizedEntityX
          : unnormalizedEntityY;
        const largerDiff: number = Math.abs(largerEnd - largerStart);
        let xEnd: number = entity.x;
        let yEnd: number = entity.y;
        for (let i: number = 0; i <= largerDiff; i++) {
          const largerAddition: number = Math.min(1, largerDiff - i);
          const smallerAddition: number =
            largerAddition *
            (Math.abs(smallerVelocity) / Math.abs(largerVelocity));
          if (isXLarger) {
            if (entity.xVelocity >= 0) {
              xEnd += largerAddition;
            } else {
              xEnd -= largerAddition;
            }
            if (entity.yVelocity >= 0) {
              yEnd += smallerAddition;
            } else {
              yEnd -= smallerAddition;
            }
          } else {
            if (entity.xVelocity >= 0) {
              xEnd += smallerAddition;
            } else {
              xEnd -= smallerAddition;
            }
            if (entity.yVelocity >= 0) {
              yEnd += largerAddition;
            } else {
              yEnd -= largerAddition;
            }
          }
        }
        entity.x = xEnd;
        entity.y = yEnd;
      }
    }
  }
};

export default updateLevel;
