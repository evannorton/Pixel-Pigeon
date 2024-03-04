import { CollisionData } from "../types/CollisionData";
import {
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
  Layer,
  Level,
} from "../types/World";
import { OverlapData } from "../types/OverlapData";
import { Quadrilateral } from "../classes/Quadrilateral";
import { Sprite } from "../classes/Sprite";
import { getDefinable } from "./getDefinable";
import { getToken } from "./getToken";
import { state } from "../state";

export interface CreateEntityOptions {
  collidesWithMap?: boolean;
  /** The actual height of the hitbox of the entity */
  height: number;
  /** The layerID the entity should be on, has to be created in LDTK */
  layerID: string;
  levelID: string;
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
 * @param options Options used to define what an entity is and their attributes
 * @returns String ID of the entity
 */
export const createEntity = (options: CreateEntityOptions): string => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to spawn an entity before world was loaded.",
    );
  }
  if (typeof options.sprites !== "undefined") {
    for (const entitySprite of options.sprites) {
      const sprite: Sprite = getDefinable(Sprite, entitySprite.spriteID);
      if (sprite.isAttached()) {
        throw new Error(
          "Attempted to attach sprite to entity that is already attached to another render condition.",
        );
      }
    }
  }
  if (typeof options.quadrilaterals !== "undefined") {
    for (const entityQuadrilateral of options.quadrilaterals) {
      const quadrilateral: Quadrilateral = getDefinable(
        Quadrilateral,
        entityQuadrilateral.quadrilateralID,
      );
      if (quadrilateral.isAttached()) {
        throw new Error(
          "Attempted to attach quadrilateral to entity that is already attached to another render condition.",
        );
      }
    }
  }
  const level: Level | null =
    state.values.world.levels.get(options.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant active level.",
    );
  }
  const layer: Layer | null =
    level.layers.find(
      (levelLayer: Layer): boolean => levelLayer.id === options.layerID,
    ) ?? null;
  if (layer === null) {
    throw new Error(
      "An attempt was made to spawn an entity with a nonexistant layer.",
    );
  }
  const id: string = getToken();
  layer.entities.set(id, {
    blockingPosition: null,
    collidesWithMap: options.collidesWithMap ?? false,
    fieldValues: new Map(),
    hasTouchedPathingStartingTile: false,
    height: options.height,
    id,
    lastPathedTilePosition: null,
    movementVelocity: null,
    onCollision: options.onCollision ?? null,
    onOverlap: options.onOverlap ?? null,
    path: null,
    pathing: null,
    position: {
      x: options.position.x,
      y: options.position.y,
    },
    quadrilaterals: options.quadrilaterals ?? [],
    sprites: options.sprites ?? [],
    type: options.type ?? null,
    width: options.width,
    zIndex: options.zIndex ?? 0,
  });
  return id;
};
