import { CollisionData } from "../types/CollisionData";
import { EntityCollidable } from "../types/EntityCollidable";
import { Layer, Level } from "../types/World";
import { OverlapData } from "../types/OverlapData";
import { getToken } from "./getToken";
import { state } from "../state";

export interface SpawnEntityOptions<CollisionLayer extends string> {
  /** An array of strings for LayerIDs that the entity can collide with and not pass through */
  readonly collidableLayers?: CollisionLayer[];
  /** The string LayerID the entity is apart of for the sake of collisions with other entities */
  readonly collisionLayer?: CollisionLayer;
  /** The actual height of the hitbox of the entity */
  readonly height: number;
  /** The layerID the entity should be on, has to be created in LDTK */
  readonly layerID: string;
  /**
   * Callback that triggers whenever a collision stops entites from moving through each other. Will not trigger on tiles that have pmgfCollision set to true.
   * The same collision cannot trigger onCollision and onOverlap
   */
  readonly onCollision?: (collisionData: CollisionData<CollisionLayer>) => void;
  /**
   * Callback that triggers whenever an entity passes through another.
   * The same collision cannot trigger onCollision and onOverlap
   */
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
    movementVelocity: null,
    onCollision: spawnEntityOptions.onCollision ?? null,
    onOverlap: spawnEntityOptions.onOverlap ?? null,
    path: null,
    pathing: null,
    position:
      typeof spawnEntityOptions.position !== "undefined"
        ? {
            x: spawnEntityOptions.position.x,
            y: spawnEntityOptions.position.y,
          }
        : null,
    spriteInstanceID: spawnEntityOptions.spriteInstanceID ?? null,
    width: spawnEntityOptions.width,
    zIndex: spawnEntityOptions.zIndex,
  });
  return id;
};
