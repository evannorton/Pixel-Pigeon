import { CollisionData } from "./CollisionData";
import { EntityCollidable } from "./EntityCollidable";
import { EntityPosition } from "./EntityPosition";
import { OverlapData } from "./OverlapData";
import { Pathing } from "./Pathing";
import { TilePosition } from "./TilePosition";

export interface Entity {
  readonly collidables: EntityCollidable[];
  readonly collisionLayer: string | null;
  readonly fieldValues: Map<string, unknown>;
  hasTouchedPathingStartingTile: boolean;
  readonly height: number;
  readonly id: string;
  lastPathedTilePosition: EntityPosition | null;
  readonly onCollision: ((data: CollisionData) => void) | null;
  readonly onOverlap: ((data: OverlapData) => void) | null;
  path: TilePosition[] | null;
  pathing: Pathing | null;
  position: EntityPosition;
  readonly spriteInstanceID: string | null;
  readonly width: number;
  movementVelocity: {
    readonly x: number;
    readonly y: number;
  } | null;
  readonly zIndex: number;
}
export interface Layer {
  readonly entities: Map<string, Entity>;
  readonly id: string;
  readonly tileSize: number;
  readonly tiles: {
    readonly id: number;
    readonly x: number;
    readonly y: number;
  }[];
  readonly tilesetID: string | null;
}
export interface Level {
  readonly height: number;
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
export interface WorldTilesetTile {
  readonly id: number;
  readonly isCollidable: boolean;
}
export interface World {
  readonly levels: Map<string, Level>;
  readonly tilesets: Map<string, Tileset>;
}
