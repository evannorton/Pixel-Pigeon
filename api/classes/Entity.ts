import { Application } from "pixi.js";
import { Button } from "./Button";
import { CollisionData } from "../types/CollisionData";
import { Definable } from "./Definable";
import { js as EasyStar } from "easystarjs";
import { Ellipse } from "./Ellipse";
import {
  EntityButton,
  EntityEllipse,
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
  Layer,
  Level,
  Tileset,
  WorldTilesetTile,
} from "../types/World";
import { OverlapData } from "../types/OverlapData";
import { Pathing } from "../types/Pathing";
import { PathingEntityExclusion } from "../types/PathingEntityExclusion";
import { PathingTileExclusion } from "../types/PathingTileExclusion";
import { Quadrilateral } from "./Quadrilateral";
import { Sprite } from "./Sprite";
import { TilePosition } from "../types/TilePosition";
import { getDefinable } from "../functions/getDefinable";
import { getEntityRectangleOverlapData } from "../functions/getEntityRectangleOverlapData";
import { getRectangleCollisionData } from "../functions/getRectangleCollisionData";
import { getToken } from "../functions/getToken";
import { handleCaughtError } from "../functions/handleCaughtError";
import { state } from "../state";
import { unlockCameraFromEntity } from "../functions/unlockCameraFromEntity";

export interface CreateEntityOptions {
  buttons?: EntityButton[];
  collidableEntityTypes?: string[];
  collidesWithMap?: boolean;
  ellipses?: EntityEllipse[];
  fieldValues?: Map<string, unknown>;
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
export class Entity extends Definable {
  private _blockingPosition: EntityPosition | null = null;
  private readonly _buttons: EntityButton[] = [];
  private readonly _collidableEntityTypes: string[];
  private readonly _collidesWithMap: boolean;
  private readonly _ellipses: EntityEllipse[];
  private readonly _fieldValues: Map<string, unknown>;
  private _hasTouchedPathingStartingTile: boolean = false;
  private readonly _height: number;
  private _lastPathedTilePosition: EntityPosition | null = null;
  private _movementVelocity: {
    readonly x: number;
    readonly y: number;
  } | null = null;

  private readonly _onCollision: ((data: CollisionData) => void) | null;
  private readonly _onOverlap: ((data: OverlapData) => void) | null;
  private _pathTilePositions: TilePosition[] | null = null;
  private _pathing: Pathing | null = null;
  private _position: EntityPosition;
  private readonly _quadrilaterals: EntityQuadrilateral[];
  private _sprites: EntitySprite[];
  private readonly _type: string | null;
  private readonly _width: number;
  private _zIndex: number;
  public constructor(options: CreateEntityOptions) {
    if (state.values.world === null) {
      throw new Error(
        "An attempt was made to create an entity before world was loaded.",
      );
    }
    const id: string = getToken();
    super(id);
    const level: Level | null =
      state.values.world.levels.get(options.levelID) ?? null;
    if (level === null) {
      throw new Error(
        "An attempt was made to create an entity with a nonexistant active level.",
      );
    }
    const layer: Layer | null =
      level.layers.find(
        (levelLayer: Layer): boolean => levelLayer.id === options.layerID,
      ) ?? null;
    if (layer === null) {
      throw new Error(
        "An attempt was made to create an entity with a nonexistant layer.",
      );
    }
    layer.entityIDs.push(id);
    if (typeof options.buttons !== "undefined") {
      for (const entityButton of options.buttons) {
        const button: Button = getDefinable(Button, entityButton.buttonID);
        if (button.isAttached()) {
          throw new Error(
            "An attempt was made to attach button to entity that is already attached to another render condition.",
          );
        }
        button.entity = {
          entityButton,
          entityID: id,
        };
      }
    }
    if (typeof options.sprites !== "undefined") {
      for (const entitySprite of options.sprites) {
        const sprite: Sprite = getDefinable(Sprite, entitySprite.spriteID);
        if (sprite.isAttached()) {
          throw new Error(
            "An attempt was made to attach sprite to entity that is already attached to another render condition.",
          );
        }
        sprite.entityID = id;
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
            "An attempt was made to attach quadrilateral to entity that is already attached to another render condition.",
          );
        }
        quadrilateral.entityID = id;
      }
    }
    if (typeof options.ellipses !== "undefined") {
      for (const entityEllipse of options.ellipses) {
        const ellipse: Ellipse = getDefinable(Ellipse, entityEllipse.ellipseID);
        if (ellipse.isAttached()) {
          throw new Error(
            "An attempt was made to attach ellipse to entity that is already attached to another render condition.",
          );
        }
        ellipse.entityID = id;
      }
    }
    this._buttons =
      typeof options.buttons !== "undefined" ? options.buttons : [];
    this._collidableEntityTypes =
      typeof options.collidableEntityTypes !== "undefined"
        ? [...options.collidableEntityTypes]
        : [];
    this._collidesWithMap = options.collidesWithMap ?? false;
    this._ellipses =
      typeof options.ellipses !== "undefined" ? options.ellipses : [];
    this._fieldValues =
      typeof options.fieldValues !== "undefined"
        ? new Map(options.fieldValues)
        : new Map<string, unknown>();
    this._height = options.height;
    this._onCollision = options.onCollision ?? null;
    this._onOverlap = options.onOverlap ?? null;
    this._position = {
      x: options.position.x,
      y: options.position.y,
    };
    this._quadrilaterals =
      typeof options.quadrilaterals !== "undefined"
        ? options.quadrilaterals
        : [];
    this._sprites =
      typeof options.sprites !== "undefined" ? options.sprites : [];
    this._type = options.type ?? null;
    this._width = options.width;
    this._zIndex = options.zIndex ?? 0;
  }

  public get blockingPosition(): EntityPosition {
    if (this._blockingPosition !== null) {
      return this._blockingPosition;
    }
    throw new Error(this.getAccessorErrorMessage("blockingPosition"));
  }

  public get ellipses(): EntityEllipse[] {
    return [...this._ellipses];
  }

  public get hasTouchedPathingStartingTile(): boolean {
    return this._hasTouchedPathingStartingTile;
  }

  public get height(): number {
    return this._height;
  }

  public get pathTilePositions(): TilePosition[] {
    if (this._pathTilePositions !== null) {
      return this._pathTilePositions;
    }
    throw new Error(this.getAccessorErrorMessage("path"));
  }

  public get position(): EntityPosition {
    return this._position;
  }

  public get quadrilaterals(): EntityQuadrilateral[] {
    return [...this._quadrilaterals];
  }

  public get sprites(): EntitySprite[] {
    return [...this._sprites];
  }

  public get type(): string {
    if (this._type !== null) {
      return this._type;
    }
    throw new Error(this.getAccessorErrorMessage("type"));
  }

  public get width(): number {
    return this._width;
  }

  public get zIndex(): number {
    return this._zIndex;
  }

  public addEllipse(entityEllipse: EntityEllipse): void {
    this._ellipses.push(entityEllipse);
    const ellipse: Ellipse = getDefinable(Ellipse, entityEllipse.ellipseID);
    ellipse.entityID = this._id;
  }

  public addQuadrilateral(entityQuadrilateral: EntityQuadrilateral): void {
    this._quadrilaterals.push(entityQuadrilateral);
    const ellipse: Quadrilateral = getDefinable(
      Quadrilateral,
      entityQuadrilateral.quadrilateralID,
    );
    ellipse.entityID = this._id;
  }

  public addSprite(entitySprite: EntitySprite): void {
    this._sprites.push(entitySprite);
    const sprite: Sprite = getDefinable(Sprite, entitySprite.spriteID);
    sprite.entityID = this._id;
  }

  public getCalculatedPath(
    options: GetEntityCalculatedPathOptions,
  ): EntityPosition[] {
    let path: EntityPosition[] = [];
    const layer: Layer = this.getLayer();
    const startX: number = Math.floor(this._position.x / layer.tileSize);
    const startY: number = Math.floor(this._position.y / layer.tileSize);
    const endX: number = Math.floor(options.x / layer.tileSize);
    const endY: number = Math.floor(options.y / layer.tileSize);
    const matrix: number[][] = this.getPathingMatrix(
      (options.exclusions ?? []).map(
        (exclusion: PathingEntityExclusion): PathingTileExclusion => ({
          tilePosition: {
            x: Math.floor(exclusion.entityPosition.x / layer.tileSize),
            y: Math.floor(exclusion.entityPosition.y / layer.tileSize),
          },
          type: exclusion.type,
        }),
      ),
    );
    const easystar: EasyStar = new EasyStar();
    easystar.setAcceptableTiles([0]);
    easystar.setGrid(matrix);
    easystar.enableDiagonals();
    easystar.disableCornerCutting();
    easystar.enableSync();
    easystar.findPath(
      startX,
      startY,
      endX,
      endY,
      (tilePath: TilePosition[] | null): void => {
        if (tilePath !== null) {
          path = tilePath.map(
            (tilePosition: TilePosition): EntityPosition => ({
              x: tilePosition.x * layer.tileSize,
              y: tilePosition.y * layer.tileSize,
            }),
          );
        }
      },
    );
    easystar.calculate();
    return path;
  }

  public getFieldValue(fieldID: string): unknown {
    return this._fieldValues.get(fieldID) ?? null;
  }

  public hasBlockingPosition(): boolean {
    return this._blockingPosition !== null;
  }

  public hasPath(): boolean {
    return this._pathTilePositions !== null;
  }

  public hasType(): boolean {
    return this._type !== null;
  }

  public isPathing(): boolean {
    return (
      this._pathTilePositions !== null && this._pathTilePositions.length > 0
    );
  }

  public move(options: MoveEntityOptions): void {
    if (state.values.world === null) {
      throw new Error(
        `An attempt was made to move Entity "${this._id}" before world was loaded.`,
      );
    }
    this._movementVelocity = {
      x: options.xVelocity ?? 0,
      y: options.yVelocity ?? 0,
    };
    this._hasTouchedPathingStartingTile = false;
    this._lastPathedTilePosition = null;
    this._pathTilePositions = null;
    this._pathing = null;
  }

  public path(options: PathEntityOptions): void {
    this._movementVelocity = null;
    this._pathTilePositions = null;
    this._pathing = {
      velocity: options.velocity,
      x: options.x,
      y: options.y,
    };
  }

  public remove(): void {
    if (state.values.world === null) {
      throw new Error(
        `An attempt was made to remove entity instance "${this._id}" before world was loaded.`,
      );
    }
    super.remove();
    for (const entitySprite of this._sprites) {
      getDefinable(Sprite, entitySprite.spriteID).remove();
    }
    for (const entityQuadrilateral of this._quadrilaterals) {
      getDefinable(Quadrilateral, entityQuadrilateral.quadrilateralID).remove();
    }
    for (const entityEllipse of this._ellipses) {
      getDefinable(Ellipse, entityEllipse.ellipseID).remove();
    }
    for (const entityButton of this._buttons) {
      getDefinable(Button, entityButton.buttonID).remove();
    }
    const layer: Layer = this.getLayer();
    const entityIndex: number = layer.entityIDs.indexOf(this._id);
    if (entityIndex !== -1) {
      layer.entityIDs.splice(entityIndex, 1);
    }
    if (this._id === state.values.cameraLockedEntityID) {
      unlockCameraFromEntity();
    }
  }

  public removeSprite(spriteID: string): void {
    this._sprites = this._sprites.filter(
      (sprite: EntitySprite): boolean => sprite.spriteID !== spriteID,
    );
    getDefinable(Sprite, spriteID).remove();
  }

  public setBlockingPosition(blockingPosition: EntityPosition): void {
    this._blockingPosition = blockingPosition;
  }

  public setLevel(levelID: string): void {
    if (state.values.world === null) {
      throw new Error(
        `An attempt was made to set Entity "${this._id}" level before world was loaded.`,
      );
    }
    const newLevel: Level | null =
      state.values.world.levels.get(levelID) ?? null;
    if (newLevel === null) {
      throw new Error(
        `An attempt was made to set Entity "${this._id}" level with nonexistant level "${levelID}".`,
      );
    }
    const layer: Layer = this.getLayer();
    layer.entityIDs.splice(layer.entityIDs.indexOf(this._id), 1);
    const newLayer: Layer | null =
      newLevel.layers.find(
        (newLevelLayer: Layer): boolean => newLevelLayer.id === layer.id,
      ) ?? null;
    if (newLayer !== null) {
      newLayer.entityIDs.push(this._id);
    }
  }

  public setPosition(position: EntityPosition): void {
    this._position = {
      x: position.x,
      y: position.y,
    };
    this._pathing = null;
    const collisionData: CollisionData = getRectangleCollisionData({
      rectangle: {
        height: this._height,
        width: this._width,
        x: Math.floor(this._position.x),
        y: Math.floor(this._position.y),
      },
    });
    if (
      collisionData.entityCollidables.length > 0 ||
      (this._collidesWithMap && collisionData.map)
    ) {
      if (this._onCollision !== null) {
        try {
          this._onCollision(collisionData);
        } catch (error: unknown) {
          handleCaughtError(error, `Entity "${this._id}" onCollision`, true);
        }
      }
    }
  }

  public setZIndex(zIndex: number): void {
    this._zIndex = zIndex;
  }

  public stop(): void {
    this._movementVelocity = null;
    this._pathing = null;
  }

  public updateMovement(): void {
    if (state.values.app === null) {
      throw new Error(
        `An attempt was made to update movement of entity "${this._id}" before app was created.`,
      );
    }
    if (
      this._pathing === null &&
      this._movementVelocity !== null &&
      (this._movementVelocity.x !== 0 || this._movementVelocity.y !== 0)
    ) {
      const unnormalizedEntityX: number =
        this._position.x +
        this._movementVelocity.x * (state.values.app.ticker.deltaMS / 1000);
      const unnormalizedEntityY: number =
        this._position.y +
        this._movementVelocity.y * (state.values.app.ticker.deltaMS / 1000);
      const isXLarger: boolean =
        Math.abs(this._movementVelocity.x) >=
        Math.abs(this._movementVelocity.y);
      const largerVelocity: number = isXLarger
        ? this._movementVelocity.x
        : this._movementVelocity.y;
      const smallerVelocity: number = !isXLarger
        ? this._movementVelocity.x
        : this._movementVelocity.y;
      const largerStart: number = isXLarger
        ? this._position.x
        : this._position.y;
      const largerEnd: number = isXLarger
        ? unnormalizedEntityX
        : unnormalizedEntityY;
      const largerDiff: number = Math.abs(largerEnd - largerStart);
      let xEnd: number = this._position.x;
      let yEnd: number = this._position.y;
      for (let i: number = 0; i <= largerDiff; i++) {
        const largerAddition: number = Math.min(1, largerDiff - i);
        const smallerAddition: number =
          largerAddition *
          (Math.abs(smallerVelocity) / Math.abs(largerVelocity));
        let pieceXEnd: number = 0;
        let pieceYEnd: number = 0;
        if (isXLarger) {
          if (this._movementVelocity.x >= 0) {
            pieceXEnd += largerAddition;
          } else {
            pieceXEnd -= largerAddition;
          }
          if (this._movementVelocity.y >= 0) {
            pieceYEnd += smallerAddition;
          } else {
            pieceYEnd -= smallerAddition;
          }
        } else {
          if (this._movementVelocity.x >= 0) {
            pieceXEnd += smallerAddition;
          } else {
            pieceXEnd -= smallerAddition;
          }
          if (this._movementVelocity.y >= 0) {
            pieceYEnd += largerAddition;
          } else {
            pieceYEnd -= largerAddition;
          }
        }
        const xCollisionData: CollisionData = getRectangleCollisionData({
          entityTypes: this._collidableEntityTypes,
          excludedEntityIDs: [this._id],
          rectangle: {
            height: this._height,
            width: this._width,
            x: Math.floor(xEnd + pieceXEnd),
            y: Math.floor(yEnd),
          },
        });
        const yCollisionData: CollisionData | null = getRectangleCollisionData({
          entityTypes: this._collidableEntityTypes,
          excludedEntityIDs: [this._id],
          rectangle: {
            height: this._height,
            width: this._width,
            x: Math.floor(xEnd),
            y: Math.floor(yEnd + pieceYEnd),
          },
        });
        const bothCollisionData: CollisionData = getRectangleCollisionData({
          entityTypes: this._collidableEntityTypes,
          excludedEntityIDs: [this._id],
          rectangle: {
            height: this._height,
            width: this._width,
            x: Math.floor(xEnd + pieceXEnd),
            y: Math.floor(yEnd + pieceYEnd),
          },
        });
        const canMoveX: boolean =
          (this._collidesWithMap === false || xCollisionData.map === false) &&
          xCollisionData.entityCollidables.length === 0;
        const canMoveY: boolean =
          (this._collidesWithMap === false || yCollisionData.map === false) &&
          yCollisionData.entityCollidables.length === 0;
        const canMoveBoth: boolean =
          (this._collidesWithMap === false ||
            bothCollisionData.map === false) &&
          bothCollisionData.entityCollidables.length === 0;
        // Diagonal move
        if (
          canMoveX &&
          canMoveY &&
          canMoveBoth &&
          this._movementVelocity.x !== 0 &&
          this._movementVelocity.y !== 0
        ) {
          xEnd += pieceXEnd;
          yEnd += pieceYEnd;
        }
        // Vertical move
        else if (canMoveY && this._movementVelocity.y !== 0) {
          yEnd += pieceYEnd;
        }
        // Horizontal move
        else if (canMoveX && this._movementVelocity.x !== 0) {
          xEnd += pieceXEnd;
        }
        // On collision
        if (
          (this._collidesWithMap && bothCollisionData.map) ||
          bothCollisionData.entityCollidables.length > 0 ||
          (this._collidesWithMap && xCollisionData.map) ||
          xCollisionData.entityCollidables.length > 0 ||
          (this._collidesWithMap && yCollisionData.map) ||
          yCollisionData.entityCollidables.length > 0
        ) {
          if (this._onCollision !== null) {
            try {
              this._onCollision(bothCollisionData);
            } catch (error: unknown) {
              handleCaughtError(
                error,
                `Entity "${this._id}" onCollision`,
                true,
              );
            }
          }
        }
      }
      this._position = {
        x: xEnd,
        y: yEnd,
      };
    }
  }

  public updateOverlap(): void {
    const collisionData: CollisionData = getEntityRectangleOverlapData(
      this._id,
      {
        height: this._height,
        width: this._width,
        x: Math.floor(this._position.x),
        y: Math.floor(this._position.y),
      },
    );
    if (collisionData.entityCollidables.length > 0 || collisionData.map) {
      if (this._onOverlap !== null) {
        try {
          this._onOverlap(collisionData);
        } catch (error: unknown) {
          handleCaughtError(error, `Entity "${this._id}" onOverlap`, true);
        }
      }
    }
  }

  public updatePathing(): void {
    if (state.values.app === null) {
      throw new Error(
        `An attempt was made to update pathing of entity "${this._id}" before app was created.`,
      );
    }
    const app: Application<HTMLCanvasElement> = state.values.app;
    const pathing: Pathing | null = this._pathing;
    if (pathing !== null) {
      const layer: Layer = this.getLayer();
      const startX: number = Math.floor(this._position.x / layer.tileSize);
      const startY: number = Math.floor(this._position.y / layer.tileSize);
      const endX: number = Math.floor(pathing.x / layer.tileSize);
      const endY: number = Math.floor(pathing.y / layer.tileSize);
      const matrix: number[][] = this.getPathingMatrix([]);
      const easystar: EasyStar = new EasyStar();
      easystar.setAcceptableTiles([0]);
      easystar.setGrid(matrix);
      easystar.enableDiagonals();
      easystar.disableCornerCutting();
      easystar.enableSync();
      easystar.findPath(
        startX,
        startY,
        endX,
        endY,
        (path: TilePosition[] | null): void => {
          this._pathTilePositions = path;
          if (path !== null) {
            const nextTilePosition: TilePosition | undefined =
              path.length > 1
                ? path[1]
                : path.length === 1
                  ? path[0]
                  : {
                      x: startX,
                      y: startY,
                    };
            if (typeof nextTilePosition === "undefined") {
              throw new Error("Out of bounds path index");
            }
            if (
              this._lastPathedTilePosition === null ||
              this._lastPathedTilePosition.x !== nextTilePosition.x ||
              this._lastPathedTilePosition.y !== nextTilePosition.y
            ) {
              this._hasTouchedPathingStartingTile = false;
            }
            this._lastPathedTilePosition = {
              x: nextTilePosition.x,
              y: nextTilePosition.y,
            };
            const nextTileX: number = this._hasTouchedPathingStartingTile
              ? nextTilePosition.x * layer.tileSize
              : startX * layer.tileSize;
            const nextTileY: number = this._hasTouchedPathingStartingTile
              ? nextTilePosition.y * layer.tileSize
              : startY * layer.tileSize;
            const step: number = pathing.velocity * (app.ticker.deltaMS / 1000);
            if (nextTileX > this._position.x) {
              this._position.x = Math.min(this._position.x + step, nextTileX);
            } else {
              this._position.x = Math.max(this._position.x - step, nextTileX);
            }
            if (nextTileY > this._position.y) {
              this._position.y = Math.min(this._position.y + step, nextTileY);
            } else {
              this._position.y = Math.max(this._position.y - step, nextTileY);
            }
            if (
              this._position.x === nextTileX &&
              this._position.y === nextTileY
            ) {
              this._hasTouchedPathingStartingTile = true;
            }
          }
        },
      );
      easystar.calculate();
    }
  }

  private getLayer(): Layer {
    if (state.values.world === null) {
      throw new Error(
        `An attempt was made to get layer of entity "${this._id}" before world was loaded.`,
      );
    }
    for (const level of state.values.world.levels.values()) {
      for (const layer of level.layers) {
        if (layer.entityIDs.includes(this._id)) {
          return layer;
        }
      }
    }
    throw new Error("Could not find layer of entity");
  }

  private getPathingMatrix(exclusions: PathingTileExclusion[]): number[][] {
    if (state.values.world === null) {
      throw new Error(
        "An attempt was made to get pathing matrix before world was loaded.",
      );
    }
    const matrix: number[][] = [];
    const layer: Layer = this.getLayer();
    for (const layerTile of layer.tiles) {
      const tileset: Tileset | null =
        state.values.world.tilesets.get(layerTile.tilesetID) ?? null;
      if (tileset === null) {
        throw new Error(
          `Tileset with id "${layerTile.tilesetID}" not found in world.`,
        );
      }
      const matchedTile: WorldTilesetTile | undefined =
        tileset.tiles[
          layerTile.tilesetX +
            layerTile.tilesetY * (tileset.width / tileset.tileSize)
        ];
      if (typeof matchedTile === "undefined") {
        throw new Error("Out of bounds tiles index");
      }
      const x: number = Math.floor(layerTile.x / layer.tileSize);
      const y: number = Math.floor(layerTile.y / layer.tileSize);
      if (typeof matrix[y] === "undefined") {
        matrix[y] = [];
      }
      if (typeof (matrix[y] as number[])[x] === "undefined") {
        (matrix[y] as number[])[x] = 0;
      }
      if (this._collidesWithMap && matchedTile.isCollidable) {
        (matrix[y] as number[])[x] = 1;
      }
    }
    for (const layerEntityID of layer.entityIDs.values()) {
      const layerEntity: Entity = getDefinable(Entity, layerEntityID);
      if (
        layerEntityID !== this._id &&
        layerEntity.hasType() &&
        this._collidableEntityTypes.includes(layerEntity.type)
      ) {
        const unroundedX: number =
          layerEntity._blockingPosition?.x ?? layerEntity.position.x;
        const unroundedY: number =
          layerEntity._blockingPosition?.y ?? layerEntity.position.y;
        const positions: [number, number][] = [
          // Top left
          [
            Math.floor(unroundedX / layer.tileSize),
            Math.floor(unroundedY / layer.tileSize),
          ],
          // Top right
          [
            Math.floor((unroundedX + this._width - 1) / layer.tileSize),
            Math.floor(unroundedY / layer.tileSize),
          ],
          // Bottom left
          [
            Math.floor(unroundedX / layer.tileSize),
            Math.floor((unroundedY + this._height - 1) / layer.tileSize),
          ],
          // Bottom right
          [
            Math.floor((unroundedX + this._width - 1) / layer.tileSize),
            Math.floor((unroundedY + this._height - 1) / layer.tileSize),
          ],
        ];
        const filteredPositions: [number, number][] = [];
        for (const [x, y] of positions) {
          if (
            !filteredPositions.some(
              ([filteredX, filteredY]: [number, number]): boolean =>
                filteredX === x && filteredY === y,
            )
          ) {
            filteredPositions.push([x, y]);
          }
        }
        for (const [x, y] of filteredPositions) {
          if (typeof matrix[y] === "undefined") {
            matrix[y] = [];
          }
          if (
            exclusions.some(
              (exclusion: PathingTileExclusion): boolean =>
                exclusion.type === layerEntity._type &&
                exclusion.tilePosition.x === x &&
                exclusion.tilePosition.y === y,
            )
          ) {
            (matrix[y] as number[])[x] = 0;
          } else {
            (matrix[y] as number[])[x] = 1;
          }
        }
      }
    }
    return matrix;
  }
}
export const createEntity = (options: CreateEntityOptions): string =>
  new Entity(options).id;
/**
 * The amount an entity is moving when supplied to {@link moveEntity}
 */
export interface MoveEntityOptions {
  /**
   * Amount the entity is moving across the X-axis
   */
  xVelocity?: number;
  /**
   * Amount the entity is moving across the Y-axis
   */
  yVelocity?: number;
}
/**
 * Move the specified entity by the specified amount in the world
 * @param entityID - The string entityID of the entity to be moved
 * @param options - The amount the entity moves
 */
export const moveEntity = (
  entityID: string,
  options: MoveEntityOptions,
): void => {
  getDefinable<Entity>(Entity, entityID).move(options);
};
/**
 * @param entityID - String EntityID of the Entity to remove
 */
export const removeEntity = (entityID: string): void => {
  getDefinable<Entity>(Entity, entityID).remove();
};
/**
 *
 * @param entityID - String EntityID to determine what entity to perform the operation on
 * @param options - Options to determine which coordinates to stop moving the entity on
 */
export const stopEntity = (entityID: string): void => {
  getDefinable<Entity>(Entity, entityID).stop();
};
export interface PathEntityOptions {
  velocity: number;
  x: number;
  y: number;
}
export const pathEntity = (
  entityID: string,
  options: PathEntityOptions,
): void => {
  getDefinable<Entity>(Entity, entityID).path(options);
};
export const setEntityLevel = (entityID: string, levelID: string): void => {
  getDefinable<Entity>(Entity, entityID).setLevel(levelID);
};
export const setEntityZIndex = (entityID: string, zIndex: number): void => {
  getDefinable<Entity>(Entity, entityID).setZIndex(zIndex);
};
export const setEntityPosition = (
  entity: string,
  position: EntityPosition,
): void => {
  getDefinable<Entity>(Entity, entity).setPosition(position);
};
export const setEntityBlockingPosition = (
  entityID: string,
  blockingPosition: EntityPosition,
): void => {
  getDefinable<Entity>(Entity, entityID).setBlockingPosition(blockingPosition);
};
export const removeEntitySprite = (
  entityID: string,
  spriteID: string,
): void => {
  getDefinable<Entity>(Entity, entityID).removeSprite(spriteID);
};
export const isEntityPathing = (entityID: string): boolean =>
  getDefinable<Entity>(Entity, entityID).isPathing();
export const addEntityEllipse = (
  entityID: string,
  entityEllipse: EntityEllipse,
): void => {
  getDefinable<Entity>(Entity, entityID).addEllipse(entityEllipse);
};
export const addEntityQuadrilateral = (
  entityID: string,
  entityQuadrilateral: EntityQuadrilateral,
): void => {
  getDefinable<Entity>(Entity, entityID).addQuadrilateral(entityQuadrilateral);
};
export const addEntitySprite = (
  entityID: string,
  entitySprite: EntitySprite,
): void => {
  getDefinable<Entity>(Entity, entityID).addSprite(entitySprite);
};
/**
 *
 * @param entityID - The string entityID of the entity to get the position of
 * @returns The position of the entity if it exists
 */
export const getEntityPosition = (entityID: string): EntityPosition =>
  getDefinable<Entity>(Entity, entityID).position;
export interface GetEntityCalculatedPathOptions {
  exclusions?: PathingEntityExclusion[];
  x: number;
  y: number;
}
export const getEntityCalculatedPath = (
  entityID: string,
  options: GetEntityCalculatedPathOptions,
): EntityPosition[] =>
  getDefinable<Entity>(Entity, entityID).getCalculatedPath(options);
export const getEntityFieldValue = (
  entityID: string,
  fieldID: string,
): unknown => getDefinable<Entity>(Entity, entityID).getFieldValue(fieldID);
