import { WorldLevel } from "../../types/World";
import rectangleContainsCollision from "pigeon-mode-game-library/api/functions/rectangleContainsCollision";
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
      "An attempt was made to update with a nonexistant active level."
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
          let pieceXEnd: number = 0;
          let pieceYEnd: number = 0;
          if (isXLarger) {
            if (entity.xVelocity >= 0) {
              pieceXEnd += largerAddition;
            } else {
              pieceXEnd -= largerAddition;
            }
            if (entity.yVelocity >= 0) {
              pieceYEnd += smallerAddition;
            } else {
              pieceYEnd -= smallerAddition;
            }
          } else {
            if (entity.xVelocity >= 0) {
              pieceXEnd += smallerAddition;
            } else {
              pieceXEnd -= smallerAddition;
            }
            if (entity.yVelocity >= 0) {
              pieceYEnd += largerAddition;
            } else {
              pieceYEnd -= largerAddition;
            }
          }
          const canMoveX: boolean = !rectangleContainsCollision(
            Math.floor(xEnd + pieceXEnd),
            Math.floor(yEnd),
            entity.width,
            entity.height
          );
          const canMoveY: boolean = !rectangleContainsCollision(
            Math.floor(xEnd),
            Math.floor(yEnd + pieceYEnd),
            entity.width,
            entity.height
          );
          const canMoveBoth: boolean = !rectangleContainsCollision(
            Math.floor(xEnd + pieceXEnd),
            Math.floor(yEnd + pieceYEnd),
            entity.width,
            entity.height
          );
          if (canMoveX && canMoveY && canMoveBoth) {
            xEnd += pieceXEnd;
            yEnd += pieceYEnd;
          } else if (!canMoveX || !canMoveY) {
            if (canMoveX) {
              xEnd += pieceXEnd;
            } else if (canMoveY) {
              yEnd += pieceYEnd;
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
