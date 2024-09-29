import { CollisionData } from "./CollisionData";
import { OverlapData } from "./OverlapData";
import { Pathing } from "./Pathing";
import { Sprite as PixiSprite, Texture } from "pixi.js";
import { TilePosition } from "./TilePosition";

/**
 * Stores information about Entity collisions.
 * Setting up collisions is done with {@link SpawnEntityOptions.onOverlap}.
 *
 * @remarks
 * If you set up collisions, the data in this interface is the data of the entity your are colliding with.
 * For example if you set up {@link SpawnEntityOptions.onOverlap | onOverlap} on a player entity,
 * any overlapData you recieve will be the data of entities the player has collided with, but will not include player collision data.
 */
export interface EntityButton {
  buttonID: string;
  onClick?: () => void;
}
export interface EntityCollidable {
  /**
   * String entityID of the collided entity
   */
  entityID: string;
  /**
   * String type that the collided entity is apart of
   */
  type: string;
}
/**
 * A representation of where the entity is in the world
 */
export interface EntityPosition {
  /**
   * X position of the entity
   */
  x: number;
  /**
   * Y position of the entity
   */
  y: number;
}
export interface EntityQuadrilateral {
  quadrilateralID: string;
  x?: number;
  y?: number;
}
export interface EntityEllipse {
  ellipseID: string;
  x?: number;
  y?: number;
}
export interface EntitySprite {
  spriteID: string;
  x?: number;
  y?: number;
}
export interface Entity {
  blockingPosition: EntityPosition | null;
  buttons: EntityButton[];
  readonly collidesWithMap: boolean;
  readonly collidableEntityTypes: string[];
  ellipses: EntityEllipse[];
  readonly fieldValues: Map<string, unknown>;
  hasTouchedPathingStartingTile: boolean;
  readonly height: number;
  readonly id: string;
  lastPathedTilePosition: EntityPosition | null;
  movementVelocity: {
    readonly x: number;
    readonly y: number;
  } | null;
  readonly onCollision: ((data: CollisionData) => void) | null;
  readonly onOverlap: ((data: OverlapData) => void) | null;
  path: TilePosition[] | null;
  pathing: Pathing | null;
  position: EntityPosition;
  quadrilaterals: EntityQuadrilateral[];
  sprites: EntitySprite[];
  readonly type: string | null;
  readonly width: number;
  zIndex: number;
}
export interface Layer {
  readonly entities: Map<string, Entity>;
  readonly id: string;
  readonly tileSize: number;
  readonly tiles: {
    readonly pixiSprite: PixiSprite;
    readonly tilesetID: string;
    readonly tilesetX: number;
    readonly tilesetY: number;
    readonly x: number;
    readonly y: number;
  }[];
}
export interface Level {
  readonly height: number;
  readonly id: string;
  readonly layers: Layer[];
  readonly width: number;
}
export interface Tileset {
  readonly height: number;
  readonly imageSourceID: string;
  readonly tileSize: number;
  readonly tiles: WorldTilesetTile[];
  readonly width: number;
}
export interface WorldTilesetTileAnimationFrame {
  readonly duration: number;
  readonly texture: Texture;
}
export interface WorldTilesetTile {
  readonly animationFrames: WorldTilesetTileAnimationFrame[];
  readonly isCollidable: boolean;
  readonly texture: Texture;
}
export interface World {
  readonly levels: Map<string, Level>;
  readonly tilesets: Map<string, Tileset>;
}
