import { CollisionData } from "../../types/CollisionData";
import { EntityCollidable, Level } from "../../types/World";
import { getRectangleCollisionData } from "../getRectangleCollisionData";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";

export const updateLevelMovement = (): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to update level movement before app was created.",
    );
  }
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to update level movement before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to update level movement with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to update level movement with a nonexistant active level.",
    );
  }
  for (const layer of level.layers) {
    for (const [, entity] of layer.entities) {
      if (entity.pathing === null && entity.movementVelocity !== null) {
        const unnormalizedEntityX: number =
          entity.position.x +
          entity.movementVelocity.x * (state.values.app.ticker.deltaMS / 1000);
        const unnormalizedEntityY: number =
          entity.position.y +
          entity.movementVelocity.y * (state.values.app.ticker.deltaMS / 1000);
        const isXLarger: boolean =
          Math.abs(entity.movementVelocity.x) >=
          Math.abs(entity.movementVelocity.y);
        const largerVelocity: number = isXLarger
          ? entity.movementVelocity.x
          : entity.movementVelocity.y;
        const smallerVelocity: number = !isXLarger
          ? entity.movementVelocity.x
          : entity.movementVelocity.y;
        const largerStart: number = isXLarger
          ? entity.position.x
          : entity.position.y;
        const largerEnd: number = isXLarger
          ? unnormalizedEntityX
          : unnormalizedEntityY;
        const largerDiff: number = Math.abs(largerEnd - largerStart);
        let xEnd: number = entity.position.x;
        let yEnd: number = entity.position.y;
        for (let i: number = 0; i <= largerDiff; i++) {
          const largerAddition: number = Math.min(1, largerDiff - i);
          const smallerAddition: number =
            largerAddition *
            (Math.abs(smallerVelocity) / Math.abs(largerVelocity));
          let pieceXEnd: number = 0;
          let pieceYEnd: number = 0;
          if (isXLarger) {
            if (entity.movementVelocity.x >= 0) {
              pieceXEnd += largerAddition;
            } else {
              pieceXEnd -= largerAddition;
            }
            if (entity.movementVelocity.y >= 0) {
              pieceYEnd += smallerAddition;
            } else {
              pieceYEnd -= smallerAddition;
            }
          } else {
            if (entity.movementVelocity.x >= 0) {
              pieceXEnd += smallerAddition;
            } else {
              pieceXEnd -= smallerAddition;
            }
            if (entity.movementVelocity.y >= 0) {
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
              (entityCollidable: EntityCollidable): string =>
                entityCollidable.type,
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
                (entityCollidable: EntityCollidable): string =>
                  entityCollidable.type,
              ),
            );
          const bothCollisionData: CollisionData = getRectangleCollisionData(
            {
              height: entity.height,
              width: entity.width,
              x: Math.floor(xEnd + pieceXEnd),
              y: Math.floor(yEnd + pieceYEnd),
            },
            entity.collidables.map(
              (entityCollidable: EntityCollidable): string =>
                entityCollidable.type,
            ),
          );
          const canMoveX: boolean =
            // Entity has no collision layer
            entity.type === null ||
            // Entity collided with nothing
            (xCollisionData.entityCollidables.length === 0 &&
              !xCollisionData.map);
          const canMoveY: boolean =
            // Entity has no collision layer
            entity.type === null ||
            // Entity collided with nothing
            (yCollisionData.entityCollidables.length === 0 &&
              !yCollisionData.map);
          const canMoveBoth: boolean =
            // Entity has no collision layer
            entity.type === null ||
            // Entity collided with nothing
            (bothCollisionData.entityCollidables.length === 0 &&
              !bothCollisionData.map);
          // Diagonal move
          if (
            canMoveX &&
            canMoveY &&
            canMoveBoth &&
            entity.movementVelocity.x !== 0 &&
            entity.movementVelocity.y !== 0
          ) {
            xEnd += pieceXEnd;
            yEnd += pieceYEnd;
          }
          // Vertical move
          else if (canMoveY && entity.movementVelocity.y !== 0) {
            yEnd += pieceYEnd;
          }
          // Horizontal move
          else if (canMoveX && entity.movementVelocity.x !== 0) {
            xEnd += pieceXEnd;
          }
          // On collision
          if (
            bothCollisionData.map ||
            bothCollisionData.entityCollidables.length > 0 ||
            xCollisionData.map ||
            xCollisionData.entityCollidables.length > 0 ||
            yCollisionData.map ||
            yCollisionData.entityCollidables.length > 0
          ) {
            if (entity.onCollision !== null) {
              try {
                entity.onCollision(bothCollisionData);
              } catch (error: unknown) {
                handleCaughtError(error, `Entity "${entity.id}" onCollision`);
              }
            }
          }
        }
        entity.position = {
          x: xEnd,
          y: yEnd,
        };
      }
    }
  }
};
