import { Entity } from "../classes/Entity";
import { ImageSource } from "../classes/ImageSource";
import { LDTK, LDTKTileCustomData, LDTKTileData } from "../types/LDTK";
import { Level, Tileset, World, WorldTilesetTile } from "../types/World";
import { Sprite as PixiSprite, Rectangle, Texture } from "pixi.js";
import { getDefinable } from "definables";
import { state } from "../state";

export const getWorld = (): World => {
  const levels: Map<string, Level> = new Map();
  const tilesets: Map<string, Tileset> = new Map();
  if (state.values.ldtk !== null) {
    const ldtk: LDTK = state.values.ldtk;
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
              const entityIDs: string[] = [];
              for (const ldtkEntityInstance of ldtkLayerInstance.entityInstances) {
                const fieldValues: Map<string, unknown> = new Map();
                for (const fieldInstance of ldtkEntityInstance.fieldInstances) {
                  fieldValues.set(
                    fieldInstance.__identifier,
                    fieldInstance.__value,
                  );
                }
                entityIDs.push(
                  new Entity({
                    fieldValues,
                    height: ldtkEntityInstance.height,
                    layerID: ldtkLayerInstance.__identifier,
                    levelID: ldtkLevel.identifier,
                    position: {
                      x: ldtkEntityInstance.px[0],
                      y: ldtkEntityInstance.px[1],
                    },
                    type: ldtkEntityInstance.__identifier,
                    width: ldtkEntityInstance.width,
                  }).id,
                );
              }
              const tilesetID: string | null =
                matchedLDTKDefLayer !== null &&
                matchedLDTKDefLayer.tilesetDefUid !== null
                  ? ldtk.defs.tilesets.find(
                      (ldtkDefTileset: LDTK["defs"]["tilesets"][0]): boolean =>
                        ldtkDefTileset.uid ===
                        matchedLDTKDefLayer.tilesetDefUid,
                    )?.identifier ?? null
                  : null;
              return {
                entityIDs,
                id: ldtkLayerInstance.__identifier,
                tileSize: ldtkLayerInstance.__gridSize,
                tiles: ldtkLayerInstance.gridTiles.map(
                  (
                    ldtkGridTile: LDTK["levels"][0]["layerInstances"][0]["gridTiles"][0],
                  ): Level["layers"][0]["tiles"][0] => ({
                    pixiSprite: new PixiSprite(),
                    tilesetID: tilesetID as string,
                    tilesetX:
                      ldtkGridTile.src[0] / ldtkLayerInstance.__gridSize,
                    tilesetY:
                      ldtkGridTile.src[1] / ldtkLayerInstance.__gridSize,
                    x: ldtkGridTile.px[0],
                    y: ldtkGridTile.px[1],
                  }),
                ),
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
          const xSpacing: number = ldtkDefTileset.spacing * x;
          const ySpacing: number = ldtkDefTileset.spacing * y;
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
            animationFrames: [],
            isCollidable,
            texture: new Texture(
              getDefinable(ImageSource, imageSourceID).texture.baseTexture,
              new Rectangle(
                x * ldtkDefTileset.tileGridSize +
                  xSpacing +
                  ldtkDefTileset.padding,
                y * ldtkDefTileset.tileGridSize +
                  ySpacing +
                  ldtkDefTileset.padding,
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
  }
  return {
    levels,
    tilesets,
  };
};
