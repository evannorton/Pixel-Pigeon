import { Collidable } from "../../types/Collidable";
import { CollisionData } from "../../types/CollisionData";
import { EntityCollidable } from "../../types/EntityCollidable";
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
      if (
        entity.position !== null &&
        (entity.xVelocity !== 0 || entity.yVelocity !== 0)
      ) {
        const unnormalizedEntityX: number =
          entity.position.x +
          entity.xVelocity * (state.values.app.ticker.deltaMS / 1000);
        const unnormalizedEntityY: number =
          entity.position.y +
          entity.yVelocity * (state.values.app.ticker.deltaMS / 1000);
        const isXLarger: boolean =
          Math.abs(entity.xVelocity) >= Math.abs(entity.yVelocity);
        const largerVelocity: number = isXLarger
          ? entity.xVelocity
          : entity.yVelocity;
        const smallerVelocity: number = !isXLarger
          ? entity.xVelocity
          : entity.yVelocity;
        const largerStart: number = isXLarger
          ? entity.position.x
          : entity.position.y;
        const largerEnd: number = isXLarger
          ? unnormalizedEntityX
          : unnormalizedEntityY;
        const largerDiff: number = Math.abs(largerEnd - largerStart);
        let xEnd: number = entity.position.x;
        let yEnd: number = entity.position.y;
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
            {
              height: entity.height,
              width: entity.width,
              x: Math.floor(xEnd + pieceXEnd),
              y: Math.floor(yEnd),
            },
            entity.collidables.map(
              (entityCollidable: EntityCollidable): Collidable<string> =>
                entityCollidable.collidable,
            ),
          );
          const yCollisionData: CollisionData | null =
            getRectangleCollisionData(
              {
                height: entity.height,
                width: entity.width,
                x: Math.floor(xEnd),
                y: Math.floor(yEnd + pieceYEnd),
              },
              entity.collidables.map(
                (entityCollidable: EntityCollidable): Collidable<string> =>
                  entityCollidable.collidable,
              ),
            );
          const bothCollisionData: CollisionData | null =
            getRectangleCollisionData(
              {
                height: entity.height,
                width: entity.width,
                x: Math.floor(xEnd + pieceXEnd),
                y: Math.floor(yEnd + pieceYEnd),
              },
              entity.collidables.map(
                (entityCollidable: EntityCollidable): Collidable<string> =>
                  entityCollidable.collidable,
              ),
            );
          const canMoveX: boolean =
            !entity.isCollidable ||
            (xCollisionData.entityCollidables.length === 0 &&
              !xCollisionData.map);
          const canMoveY: boolean =
            !entity.isCollidable ||
            (yCollisionData.entityCollidables.length === 0 &&
              !yCollisionData.map);
          const canMoveBoth: boolean =
            !entity.isCollidable ||
            (bothCollisionData.entityCollidables.length === 0 &&
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
              bothCollisionData.entityCollidables.length > 0 ||
              bothCollisionData.map
            ) {
              collisionData = bothCollisionData;
            } else if (
              yCollisionData.entityCollidables.length > 0 ||
              yCollisionData.map
            ) {
              collisionData = yCollisionData;
            } else if (
              xCollisionData.entityCollidables.length > 0 ||
              xCollisionData.map
            ) {
              collisionData = xCollisionData;
            }
          }
        }
        if (collisionData !== null) {
          entity.onCollision?.(collisionData);
        }
        entity.position = {
          x: xEnd,
          y: yEnd,
        };
      }
    }
  }
};
