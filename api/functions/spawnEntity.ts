import { CollisionData } from "../types/CollisionData";
import {
  EntityCollidable,
  EntityPosition,
  EntityQuadrilateral,
  Layer,
  Level,
} from "../types/World";
import { OverlapData } from "../types/OverlapData";
import { getToken } from "./getToken";
import { state } from "../state";

export interface SpawnEntityOptions {
  /** An array of strings for LayerIDs that the entity can collide with and not pass through */
  collidableLayers?: string[];
  /** The string LayerID the entity is apart of for the sake of collisions with other entities */
  collisionLayer?: string;
  /** The actual height of the hitbox of the entity */
  height: number;
  /** The layerID the entity should be on, has to be created in LDTK */
  layerID: string;
  /**
   * Callback that triggers whenever a collision stops entites from moving through each other. Will not trigger on tiles that have ppCollision set to true.
   * The same collision cannot trigger onCollision and onOverlap
   */
  onCollision?: (collisionData: CollisionData) => void;
  /**
   * Callback that triggers whenever an entity passes through another.
   * The same collision cannot trigger onCollision and onOverlap
   */
  onOverlap?: (overlapData: OverlapData) => void;
  /** The X and Y position that the entity will spawn at */
  position: EntityPosition;
  quadrilaterals?: EntityQuadrilateral[];
  /** A {@link createSpriteInstance | spriteInstanceID} in order to give the entity a sprite */
  spriteInstanceID?: string;
  /** The actual width of the hitbox of the entity */
  width: number;
  /** This number determines how entities are layered on-top of eachother */
  zIndex: number;
}
/**
 * Spawn an entity into the world if the world has already loaded in
 * @param spawnEntityOptions Options used to define what an entity is and their attributes
 * @returns String ID of the entity
 */
export const spawnEntity = (spawnEntityOptions: SpawnEntityOptions): string => {
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
  const layer: Layer | null =
    level.layers.find(
      (levelLayer: Layer): boolean =>
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
        (collisionLayer: string): EntityCollidable => ({
          collisionLayer,
          entityID: id,
        }),
      ) ?? [],
    collisionLayer: spawnEntityOptions.collisionLayer ?? null,
    fieldValues: new Map(),
    hasTouchedPathingStartingTile: false,
    height: spawnEntityOptions.height,
    id,
    lastPathedTilePosition: null,
    movementVelocity: null,
    onCollision: spawnEntityOptions.onCollision ?? null,
    onOverlap: spawnEntityOptions.onOverlap ?? null,
    path: null,
    pathing: null,
    position: {
      x: spawnEntityOptions.position.x,
      y: spawnEntityOptions.position.y,
    },
    quadrilaterals: spawnEntityOptions.quadrilaterals ?? [],
    spriteInstanceID: spawnEntityOptions.spriteInstanceID ?? null,
    width: spawnEntityOptions.width,
    zIndex: spawnEntityOptions.zIndex,
  });
  return id;
};
