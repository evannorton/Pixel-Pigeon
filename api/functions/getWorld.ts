import {
  Entity,
  Level,
  Tileset,
  World,
  WorldTilesetTile,
} from "../types/World";
import { LDTK, LDTKTileData } from "../types/LDTK";

export const getWorld = (ldtk: LDTK): World => {
  const levels: Map<string, Level> = new Map();
  const tilesets: Map<string, Tileset> = new Map();
  for (const ldtkLevel of ldtk.levels) {
    levels.set(ldtkLevel.identifier, {
      height: ldtkLevel.pxHei,
      id: ldtkLevel.identifier,
      layers: [...ldtkLevel.layerInstances]
        .reverse()
        .map(
          (
            ldtkLayerInstance: LDTK["levels"][0]["layerInstances"][0],
          ): Level["layers"][0] => {
            const matchedLDTKDefLayer: LDTK["defs"]["layers"][0] | null =
              ldtk.defs.layers.find(
                (ldtkDefLayer: LDTK["defs"]["layers"][0]): boolean =>
                  ldtkDefLayer.uid === ldtkLayerInstance.layerDefUid,
              ) ?? null;
            const entities: Map<string, Entity> = new Map();
            for (const ldtkEntityInstance of ldtkLayerInstance.entityInstances) {
              const fieldValues: Map<string, unknown> = new Map();
              for (const fieldInstance of ldtkEntityInstance.fieldInstances) {
                fieldValues.set(
                  fieldInstance.__identifier,
                  fieldInstance.__value,
                );
              }
              entities.set(ldtkEntityInstance.iid, {
                collidables: [],
                collisionLayer: ldtkLayerInstance.__identifier,
                fieldValues,
                hasTouchedPathingStartingTile: false,
                height: ldtkEntityInstance.height,
                id: ldtkEntityInstance.iid,
                lastPathedTilePosition: null,
                movementVelocity: {
                  x: 0,
                  y: 0,
                },
                onCollision: null,
                onOverlap: null,
                path: null,
                pathing: null,
                position: {
                  x: ldtkEntityInstance.px[0],
                  y: ldtkEntityInstance.px[1],
                },
                quadrilaterals: [],
                spriteInstanceID: null,
                width: ldtkEntityInstance.width,
                zIndex: 0,
              });
            }
            return {
              entities,
              id: ldtkLayerInstance.__identifier,
              tileSize: ldtkLayerInstance.__gridSize,
              tiles: ldtkLayerInstance.gridTiles.map(
                (
                  ldtkGridTile: LDTK["levels"][0]["layerInstances"][0]["gridTiles"][0],
                ): Level["layers"][0]["tiles"][0] => ({
                  id: ldtkGridTile.t,
                  sourceX: ldtkGridTile.src[0],
                  sourceY: ldtkGridTile.src[1],
                  x: ldtkGridTile.px[0],
                  y: ldtkGridTile.px[1],
                }),
              ),
              tilesetID:
                matchedLDTKDefLayer !== null &&
                matchedLDTKDefLayer.tilesetDefUid !== null
                  ? ldtk.defs.tilesets.find(
                      (ldtkDefTileset: LDTK["defs"]["tilesets"][0]): boolean =>
                        ldtkDefTileset.uid ===
                        matchedLDTKDefLayer.tilesetDefUid,
                    )?.identifier ?? null
                  : null,
            };
          },
        ),
      width: ldtkLevel.pxWid,
    });
  }
  for (const ldtkDefTileset of ldtk.defs.tilesets) {
    tilesets.set(ldtkDefTileset.identifier, {
      height: ldtkDefTileset.pxHei,
      imageSourceID: ldtkDefTileset.relPath
        .substring(0, ldtkDefTileset.relPath.length - 4)
        .substring(7),
      tileSize: ldtkDefTileset.tileGridSize,
      tiles: ldtkDefTileset.customData.map(
        (
          data: LDTK["defs"]["tilesets"][0]["customData"][0],
        ): WorldTilesetTile => {
          const properties: LDTKTileData = JSON.parse(
            data.data,
          ) as LDTKTileData;
          return {
            id: data.tileId,
            isCollidable: properties.ppCollision ?? false,
          };
        },
      ),
      width: ldtkDefTileset.pxWid,
    });
  }
  return {
    levels,
    tilesets,
  };
};
