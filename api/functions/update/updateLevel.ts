import { Level } from "../../types/World";
import { rectangleContainsCollision } from "../rectangleContainsCollision";
import { state } from "../../state";

export const updateLevel = (): void => {
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
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to update with a nonexistant active level."
    );
  }
  for (const layer of level.layers) {
    for (const entityInstance of layer.entityInstances) {
      if (entityInstance.xVelocity !== 0 || entityInstance.yVelocity !== 0) {
        const unnormalizedEntityX: number =
          entityInstance.x +
          entityInstance.xVelocity * (state.values.app.ticker.deltaMS / 1000);
        const unnormalizedEntityY: number =
          entityInstance.y +
          entityInstance.yVelocity * (state.values.app.ticker.deltaMS / 1000);
        const isXLarger: boolean =
          Math.abs(entityInstance.xVelocity) >= Math.abs(entityInstance.yVelocity);
        const largerVelocity: number = isXLarger
          ? entityInstance.xVelocity
          : entityInstance.yVelocity;
        const smallerVelocity: number = !isXLarger
          ? entityInstance.xVelocity
          : entityInstance.yVelocity;
        const largerStart: number = isXLarger ? entityInstance.x : entityInstance.y;
        const largerEnd: number = isXLarger
          ? unnormalizedEntityX
          : unnormalizedEntityY;
        const largerDiff: number = Math.abs(largerEnd - largerStart);
        let xEnd: number = entityInstance.x;
        let yEnd: number = entityInstance.y;
        let collided: boolean = false;
        for (let i: number = 0; i <= largerDiff; i++) {
          const largerAddition: number = Math.min(1, largerDiff - i);
          const smallerAddition: number =
            largerAddition *
            (Math.abs(smallerVelocity) / Math.abs(largerVelocity));
          let pieceXEnd: number = 0;
          let pieceYEnd: number = 0;
          if (isXLarger) {
            if (entityInstance.xVelocity >= 0) {
              pieceXEnd += largerAddition;
            } else {
              pieceXEnd -= largerAddition;
            }
            if (entityInstance.yVelocity >= 0) {
              pieceYEnd += smallerAddition;
            } else {
              pieceYEnd -= smallerAddition;
            }
          } else {
            if (entityInstance.xVelocity >= 0) {
              pieceXEnd += smallerAddition;
            } else {
              pieceXEnd -= smallerAddition;
            }
            if (entityInstance.yVelocity >= 0) {
              pieceYEnd += largerAddition;
            } else {
              pieceYEnd -= largerAddition;
            }
          }
          const canMoveX: boolean = !entityInstance.isCollidable || !rectangleContainsCollision(
            Math.floor(xEnd + pieceXEnd),
            Math.floor(yEnd),
            entityInstance.width,
            entityInstance.height
          );
          const canMoveY: boolean = !entityInstance.isCollidable || !rectangleContainsCollision(
            Math.floor(xEnd),
            Math.floor(yEnd + pieceYEnd),
            entityInstance.width,
            entityInstance.height
          );
          const canMoveBoth: boolean = !entityInstance.isCollidable || !rectangleContainsCollision(
            Math.floor(xEnd + pieceXEnd),
            Math.floor(yEnd + pieceYEnd),
            entityInstance.width,
            entityInstance.height
          )
          // Diagonal collision
          if (!canMoveX || !canMoveY || !canMoveBoth) {
            collided = true;
          }
          // Diagonal move
          if (canMoveX && canMoveY && canMoveBoth) {
            xEnd += pieceXEnd;
            yEnd += pieceYEnd;
          }   
          // Vertical move 
          else if (canMoveY) {
            yEnd += pieceYEnd;
          }
          // Horizontal move
          else if (canMoveX) {
            xEnd += pieceXEnd;
          }
        }
        if (collided) {
          entityInstance.onCollision?.();
        }
        entityInstance.x = xEnd;
        entityInstance.y = yEnd;
      }
    }
  }
};
