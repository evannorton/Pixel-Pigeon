import { CollisionData } from "../types/CollisionData";
import {
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
  Layer,
  Level,
} from "../types/World";
import { OverlapData } from "../types/OverlapData";
import { getToken } from "./getToken";
import { state } from "../state";

export interface CreateEntityOptions {
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
  sprites?: EntitySprite[];
  type?: string;
  /** The actual width of the hitbox of the entity */
  width: number;
  /** This number determines how entities are layered on-top of eachother */
  zIndex?: number;
}
/**
 * Spawn an entity into the world if the world has already loaded in
 * @param createEntityOptions Options used to define what an entity is and their attributes
 * @returns String ID of the entity
 */
export const createEntity = (
  createEntityOptions: CreateEntityOptions,
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
  const layer: Layer | null =
    level.layers.find(
      (levelLayer: Layer): boolean =>
        levelLayer.id === createEntityOptions.layerID,
    ) ?? null;
  if (layer === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant layer.",
    );
  }
  const id: string = getToken();
  layer.entities.set(id, {
    blockingPosition: null,
    fieldValues: new Map(),
    hasTouchedPathingStartingTile: false,
    height: createEntityOptions.height,
    id,
    lastPathedTilePosition: null,
    movementVelocity: null,
    onCollision: createEntityOptions.onCollision ?? null,
    onOverlap: createEntityOptions.onOverlap ?? null,
    path: null,
    pathing: null,
    position: {
      x: createEntityOptions.position.x,
      y: createEntityOptions.position.y,
    },
    quadrilaterals: createEntityOptions.quadrilaterals ?? [],
    sprites: createEntityOptions.sprites ?? [],
    type: createEntityOptions.type ?? null,
    width: createEntityOptions.width,
    zIndex: createEntityOptions.zIndex ?? 0,
  });
  return id;
};
