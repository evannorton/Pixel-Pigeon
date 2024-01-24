import {
  Entity,
  Level,
  Tileset,
  World,
  WorldTilesetTile,
} from "../types/World";
import { ImageSource } from "../classes/ImageSource";
import { LDTK, LDTKTileCustomData, LDTKTileData } from "../types/LDTK";
import { Sprite as PixiSprite, Rectangle, Texture } from "pixi.js";
import { getDefinable } from "./getDefinable";
import { state } from "../state";

export const getWorld = (): World => {
  if (state.values.ldtk === null) {
    throw new Error("Attempted to get world with no LDTK.");
  }
  const ldtk: LDTK = state.values.ldtk;
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
                blockingPosition: null,
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
                sprites: [],
                type: ldtkEntityInstance.__identifier,
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
                  pixiSprite: new PixiSprite(),
                  tilesetX: ldtkGridTile.src[0] / ldtkLayerInstance.__gridSize,
                  tilesetY: ldtkGridTile.src[1] / ldtkLayerInstance.__gridSize,
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
    const imageSourceID: string = ldtkDefTileset.relPath
      .substring(0, ldtkDefTileset.relPath.length - 4)
      .substring(7);
    const tiles: WorldTilesetTile[] = [];
    for (let y: number = 0; y < ldtkDefTileset.__cHei; y++) {
      for (let x: number = 0; x < ldtkDefTileset.__cWid; x++) {
        const id: number = y * ldtkDefTileset.__cWid + x;
        const matchedCustomDatum: LDTKTileCustomData | null =
          ldtkDefTileset.customData.find(
            (customDatum: LDTKTileCustomData): boolean =>
              customDatum.tileId === id,
          ) ?? null;
        const properties: LDTKTileData | null =
          matchedCustomDatum !== null
            ? (JSON.parse(matchedCustomDatum.data) as LDTKTileData)
            : null;
        const isCollidable: boolean = properties
          ? properties.ppCollision ?? false
          : false;
        tiles.push({
          isCollidable,
          texture: new Texture(
            getDefinable(ImageSource, imageSourceID).texture.baseTexture,
            new Rectangle(
              x * ldtkDefTileset.tileGridSize,
              y * ldtkDefTileset.tileGridSize,
              ldtkDefTileset.tileGridSize,
              ldtkDefTileset.tileGridSize,
            ),
          ),
        });
      }
    }
    tilesets.set(ldtkDefTileset.identifier, {
      height: ldtkDefTileset.pxHei,
      imageSourceID,
      tileSize: ldtkDefTileset.tileGridSize,
      tiles,
      width: ldtkDefTileset.pxWid,
    });
  }
  return {
    levels,
    tilesets,
  };
};
