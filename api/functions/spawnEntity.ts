import { CollisionData } from "pigeon-mode-game-framework/api/types/CollisionData";
import { EntityCollidable } from "pigeon-mode-game-framework/api/types/EntityCollidable";
import { Layer, Level } from "pigeon-mode-game-framework/api/types/World";
import { OverlapData } from "pigeon-mode-game-framework/api/types/OverlapData";
import { getToken } from "pigeon-mode-game-framework/api/functions/getToken";
import { state } from "pigeon-mode-game-framework/api/state";

export interface SpawnEntityOptions<CollisionLayer extends string> {
  /** An array of strings for LayerIDs that the entity can collide with */
  readonly collidableLayers?: CollisionLayer[];
  /** The string LayerID the entity is apart of for the sake of collisions */
  readonly collisionLayer?: CollisionLayer;
  /** The actual height of the hitbox of the entity */
  readonly height: number;
  /** The layerID the entity should be on, has to be created in LDTK */
  readonly layerID: string;
  readonly onCollision?: (collisionData: CollisionData<CollisionLayer>) => void;
  readonly onOverlap?: (overlapData: OverlapData<CollisionLayer>) => void;
  /** The X and Y position that the entity will spawn at */
  readonly position?: {
    readonly x: number;
    readonly y: number;
  };
  /** A {@link createSpriteInstance | spriteInstanceID} in order to give the entity a sprite */
  readonly spriteInstanceID?: string;
  /** The actual width of the hitbox of the entity */
  readonly width: number;
  /** This number determines how entities are layered on-top of eachother */
  readonly zIndex: number;
}
/**
 * Spawn an entity into the world if the world has already loaded in
 * @param spawnEntityOptions Options used to define what an entity is and their attributes
 * @returns String ID of the entity
 */
export const spawnEntity = <CollisionLayer extends string>(
  spawnEntityOptions: SpawnEntityOptions<CollisionLayer>,
): string => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to spawn an entity before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to spawn an entity with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant active level.",
    );
  }
  const layer: Layer<CollisionLayer> | null =
    level.layers.find(
      (levelLayer: Layer<CollisionLayer>): boolean =>
        levelLayer.id === spawnEntityOptions.layerID,
    ) ?? null;
  if (layer === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant layer.",
    );
  }
  const id: string = getToken();
  layer.entities.set(id, {
    collidables:
      spawnEntityOptions.collidableLayers?.map(
        (collisionLayer: string): EntityCollidable<string> => ({
          collisionLayer,
          entityID: id,
        }),
      ) ?? [],
    collisionLayer: spawnEntityOptions.collisionLayer ?? null,
    height: spawnEntityOptions.height,
    id,
    onCollision: spawnEntityOptions.onCollision ?? null,
    onOverlap: spawnEntityOptions.onOverlap ?? null,
    position:
      typeof spawnEntityOptions.position !== "undefined"
        ? {
            x: spawnEntityOptions.position.x,
            y: spawnEntityOptions.position.y,
          }
        : null,
    spriteInstanceID: spawnEntityOptions.spriteInstanceID ?? null,
    width: spawnEntityOptions.width,
    xVelocity: 0,
    yVelocity: 0,
    zIndex: spawnEntityOptions.zIndex,
  });
  return id;
};
