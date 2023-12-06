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

export const getRectangleCollisionData = (
  rectangle: Rectangle,
  types: string[] = [],
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
    rectangle.x < 0 ||
    rectangle.y < 0 ||
    rectangle.x + rectangle.width > level.width ||
    rectangle.y + rectangle.height > level.height
  ) {
    map = true;
  }
  for (const layer of level.layers) {
    if (layer.tilesetID !== null) {
      const tileset: Tileset | null =
        state.values.world.tilesets.get(layer.tilesetID) ?? null;
      if (tileset === null) {
        throw Error("An attempt was made to render a nonexistent tileset.");
      }
      for (const layerTile of layer.tiles) {
        const matchedTile: WorldTilesetTile | null =
          tileset.tiles.find(
            (tile: WorldTilesetTile): boolean => layerTile.id === tile.id,
          ) ?? null;
        if (matchedTile !== null && matchedTile.isCollidable) {
          if (
            rectanglesOverlap(rectangle, {
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
    }
    for (const [, entity] of layer.entities) {
      const matchedLayer: string | undefined = types.find(
        (type: string): boolean => type === entity.type,
      );
      if (
        typeof matchedLayer !== "undefined" &&
        entity.type !== null &&
        rectanglesOverlap(rectangle, {
          height: entity.height,
          width: entity.width,
          x: Math.floor(entity.position.x),
          y: Math.floor(entity.position.y),
        })
      ) {
        entityCollidables.push({
          entityID: entity.id,
          type: matchedLayer,
        });
      }
    }
  }
  return {
    entityCollidables,
    map,
  };
};
