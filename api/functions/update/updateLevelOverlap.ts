import { CollisionData } from "../../types/CollisionData";
import { Level } from "../../types/World";
import { getEntityRectangleOverlapData } from "../getEntityRectangleOverlapData";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";

export const updateLevelOverlap = (): void => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to update level overlap before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to update level overlap with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to check box collision a nonexistant active level.",
    );
  }
  for (const layer of level.layers) {
    for (const [, entity] of layer.entities) {
      if (entity.position !== null) {
        const collisionData: CollisionData<string> =
          getEntityRectangleOverlapData(entity.id, {
            height: entity.height,
            width: entity.width,
            x: Math.floor(entity.position.x),
            y: Math.floor(entity.position.y),
          });
        if (collisionData.entityCollidables.length > 0 || collisionData.map) {
          if (entity.onOverlap !== null) {
            try {
              entity.onOverlap(collisionData);
            } catch (error: unknown) {
              handleCaughtError(error, `Entity "${entity.id}" onOverlap`);
            }
          }
        }
      }
    }
  }
};
