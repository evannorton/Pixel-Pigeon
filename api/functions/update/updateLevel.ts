import { CollisionData } from "pigeon-mode-game-framework/api/types/CollisionData";
import { Level } from "../../types/World";
import { getRectangleCollisionData } from "../getRectangleCollisionData";
import { state } from "../../state";

export const updateLevel = (): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to update level before app was created.",
    );
  }
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to update level before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to update level with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to update with a nonexistant active level.",
    );
  }
  for (const layer of level.layers) {
    for (const [, entity] of layer.entities) {
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
        let collisionData: CollisionData | null = null;
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
          const xCollisionData: CollisionData = getRectangleCollisionData(
            Math.floor(xEnd + pieceXEnd),
            Math.floor(yEnd),
            entity.width,
            entity.height,
            entity.collidableLayers,
          );
          const yCollisionData: CollisionData | null =
            getRectangleCollisionData(
              Math.floor(xEnd),
              Math.floor(yEnd + pieceYEnd),
              entity.width,
              entity.height,
              entity.collidableLayers,
            );
          const bothCollisionData: CollisionData | null =
            getRectangleCollisionData(
              Math.floor(xEnd + pieceXEnd),
              Math.floor(yEnd + pieceYEnd),
              entity.width,
              entity.height,
              entity.collidableLayers,
            );
          const canMoveX: boolean =
            !entity.isCollidable ||
            (xCollisionData.entityIDs.length === 0 && !xCollisionData.map);
          const canMoveY: boolean =
            !entity.isCollidable ||
            (yCollisionData.entityIDs.length === 0 && !yCollisionData.map);
          const canMoveBoth: boolean =
            !entity.isCollidable ||
            (bothCollisionData.entityIDs.length === 0 &&
              !bothCollisionData.map);
          // Diagonal move
          if (
            canMoveX &&
            canMoveY &&
            canMoveBoth &&
            entity.xVelocity !== 0 &&
            entity.yVelocity !== 0
          ) {
            xEnd += pieceXEnd;
            yEnd += pieceYEnd;
          }
          // Vertical move
          else if (canMoveY && entity.yVelocity !== 0) {
            yEnd += pieceYEnd;
          }
          // Horizontal move
          else if (canMoveX && entity.xVelocity !== 0) {
            xEnd += pieceXEnd;
          }
          // Both collision
          else {
            if (
              bothCollisionData.entityIDs.length > 0 ||
              bothCollisionData.map
            ) {
              collisionData = bothCollisionData;
            } else if (
              yCollisionData.entityIDs.length > 0 ||
              yCollisionData.map
            ) {
              collisionData = yCollisionData;
            } else if (
              xCollisionData.entityIDs.length > 0 ||
              xCollisionData.map
            ) {
              collisionData = xCollisionData;
            }
          }
        }
        if (collisionData !== null) {
          entity.onCollision?.(collisionData);
        }
        entity.x = xEnd;
        entity.y = yEnd;
      }
    }
  }
};
