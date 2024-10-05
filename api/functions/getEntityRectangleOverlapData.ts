import { Entity } from "../classes/Entity";
import {
  EntityCollidable,
  Level,
  Tileset,
  WorldTilesetTile,
} from "../types/World";
import { OverlapData } from "../types/OverlapData";
import { Rectangle } from "../types/Rectangle";
import { getDefinable } from "./getDefinable";
import { rectanglesOverlap } from "./rectanglesOverlap";
import { state } from "../state";

export const getEntityRectangleOverlapData = (
  entityID: string,
  rectangle: Rectangle,
): OverlapData => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to check rectangle overlap before world was loaded.",
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      "An attempt was made to check rectangle overlap with no active level.",
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      "An attempt was made to check rectangle overlap a nonexistant active level.",
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
      if (matchedTile.isCollidable) {
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
    for (const layerEntityID of layer.entityIDs) {
      const entity: Entity = getDefinable(Entity, layerEntityID);
      if (
        entity.id !== entityID &&
        entity.hasType() &&
        rectanglesOverlap(rectangle, {
          height: entity.height,
          width: entity.width,
          x: Math.floor(entity.position.x),
          y: Math.floor(entity.position.y),
        })
      ) {
        entityCollidables.push({
          entityID: entity.id,
          type: entity.type,
        });
      }
    }
  }
  return {
    entityCollidables,
    map,
  };
};
