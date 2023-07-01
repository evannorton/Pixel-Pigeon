import LDTK from "../types/LDTK";
import World, { WorldEntity, WorldLevel, WorldTileset } from "../types/World";

const getWorld = (ldtk: LDTK): World => {
  const entities: Map<string, WorldEntity> = new Map();
  const levels: Map<string, WorldLevel> = new Map();
  const tilesets: Map<string, WorldTileset> = new Map();
  for (const ldtkDefEntity of ldtk.defs.entities) {
    entities.set(ldtkDefEntity.identifier, {
      color: ldtkDefEntity.color,
    });
  }
  for (const ldtkLevel of ldtk.levels) {
    levels.set(ldtkLevel.identifier, {
      layers: [...ldtkLevel.layerInstances]
        .reverse()
        .map(
          (
            ldtkLayerInstance: LDTK["levels"][0]["layerInstances"][0]
          ): WorldLevel["layers"][0] => {
            const matchedLDTKDefLayer: LDTK["defs"]["layers"][0] | null =
              ldtk.defs.layers.find(
                (ldtkDefLayer: LDTK["defs"]["layers"][0]): boolean =>
                  ldtkDefLayer.uid === ldtkLayerInstance.layerDefUid
              ) ?? null;
            return {
              entities: ldtkLayerInstance.entityInstances.map(
                (
                  ldtkEntityInstance: LDTK["levels"][0]["layerInstances"][0]["entityInstances"][0]
                ): WorldLevel["layers"][0]["entities"][0] => ({
                  height: ldtkEntityInstance.height,
                  id: ldtkEntityInstance.__identifier,
                  width: ldtkEntityInstance.width,
                  x: ldtkEntityInstance.px[0],
                  xVelocity: 0,
                  y: ldtkEntityInstance.px[1],
                  yVelocity: 0,
                })
              ),
              tileSize: ldtkLayerInstance.__gridSize,
              tiles: ldtkLayerInstance.gridTiles.map(
                (
                  ldtkGridTile: LDTK["levels"][0]["layerInstances"][0]["gridTiles"][0]
                ): WorldLevel["layers"][0]["tiles"][0] => ({
                  sourceX: ldtkGridTile.src[0],
                  sourceY: ldtkGridTile.src[1],
                  x: ldtkGridTile.px[0],
                  y: ldtkGridTile.px[1],
                })
              ),
              tilesetID:
                matchedLDTKDefLayer !== null &&
                matchedLDTKDefLayer.tilesetDefUid !== null
                  ? ldtk.defs.tilesets.find(
                      (ldtkDefTileset: LDTK["defs"]["tilesets"][0]): boolean =>
                        ldtkDefTileset.uid === matchedLDTKDefLayer.tilesetDefUid
                    )?.identifier ?? null
                  : null,
            };
          }
        ),
    });
  }
  for (const ldtkDefTileset of ldtk.defs.tilesets) {
    tilesets.set(ldtkDefTileset.identifier, {
      imagePath: ldtkDefTileset.relPath
        .substring(0, ldtkDefTileset.relPath.length - 4)
        .substring(7),
      texture: null,
      tileSize: ldtkDefTileset.tileGridSize,
    });
  }
  return {
    entities,
    levels,
    tilesets,
  };
};

export default getWorld;
