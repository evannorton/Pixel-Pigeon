import { CollisionData } from "../types/CollisionData";
import {
  EntityCollidable,
  Level,
  Tileset,
  WorldTilesetTile,
} from "../types/World";
import { Rectangle } from "../types/Rectangle";
import { rectanglesOverlap } from "./rectanglesOverlap";
import { state } from "../state";

export interface GetRectangleCollisionDataOptions {
  entityTypes?: string[];
  excludedEntityIDs?: string[];
  rectangle: Rectangle;
}
export const getRectangleCollisionData = (
  options: GetRectangleCollisionDataOptions,
): CollisionData => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to check rectangle collision before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to check rectangle collision with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to check rectangle collision a nonexistant active level.",
    );
  }
  let map: boolean = false;
  const entityCollidables: EntityCollidable[] = [];
  if (
    options.rectangle.x < 0 ||
    options.rectangle.y < 0 ||
    options.rectangle.x + options.rectangle.width > level.width ||
    options.rectangle.y + options.rectangle.height > level.height
  ) {
    map = true;
  }
  for (const layer of level.layers) {
    for (const layerTile of layer.tiles) {
      const tileset: Tileset | null =
        state.values.world.tilesets.get(layerTile.tilesetID) ?? null;
      if (tileset === null) {
        throw Error("An attempt was made to render a nonexistent tileset.");
      }
      const matchedTile: WorldTilesetTile | undefined =
        tileset.tiles[
          layerTile.tilesetX +
            layerTile.tilesetY * (tileset.width / tileset.tileSize)
        ];
      if (typeof matchedTile === "undefined") {
        throw Error("Out of bounds tiles index");
      }
      if (matchedTile.isCollidable) {
        if (
          rectanglesOverlap(options.rectangle, {
            height: tileset.tileSize,
            width: tileset.tileSize,
            x: layerTile.x,
            y: layerTile.y,
          })
        ) {
          map = true;
        }
      }
    }
    for (const [, entity] of layer.entities) {
      if ((options.excludedEntityIDs ?? []).includes(entity.id) === false) {
        const matchedLayer: string | null =
          options.entityTypes?.find(
            (type: string): boolean => type === entity.type,
          ) ?? null;
        if (
          matchedLayer !== null &&
          entity.type !== null &&
          rectanglesOverlap(options.rectangle, {
            height: entity.height,
            width: entity.width,
            x: Math.floor((entity.blockingPosition ?? entity.position).x),
            y: Math.floor((entity.blockingPosition ?? entity.position).y),
          })
        ) {
          entityCollidables.push({
            entityID: entity.id,
            type: matchedLayer,
          });
        }
      }
    }
  }
  return {
    entityCollidables,
    map,
  };
};
