import LDTK from "../types/LDTK";
import World, { WorldLevel, WorldTileset } from "../types/World";

const getWorld = (ldtk: LDTK): World => {
  const levels: Map<string, WorldLevel> = new Map();
  const tilesets: Map<string, WorldTileset> = new Map();
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
            const entities: WorldLevel["layers"][0]["entities"] =
              ldtkLayerInstance.entityInstances.map(
                (
                  ldtkEntityInstance: LDTK["levels"][0]["layerInstances"][0]["entityInstances"][0]
                ): WorldLevel["layers"][0]["entities"][0] => ({
                  id: ldtkEntityInstance.__identifier,
                })
              );
            const tileSize: number = ldtkLayerInstance.__gridSize;
            const tiles: WorldLevel["layers"][0]["tiles"] =
              ldtkLayerInstance.gridTiles.map(
                (
                  ldtkGridTile: LDTK["levels"][0]["layerInstances"][0]["gridTiles"][0]
                ): WorldLevel["layers"][0]["tiles"][0] => ({
                  sourceX: ldtkGridTile.src[0],
                  sourceY: ldtkGridTile.src[1],
                  x: ldtkGridTile.px[0],
                  y: ldtkGridTile.px[1],
                })
              );
            const tilesetID: string | null =
              matchedLDTKDefLayer !== null &&
              matchedLDTKDefLayer.tilesetDefUid !== null
                ? ldtk.defs.tilesets.find(
                    (ldtkDefTileset: LDTK["defs"]["tilesets"][0]): boolean =>
                      ldtkDefTileset.uid === matchedLDTKDefLayer.tilesetDefUid
                  )?.identifier ?? null
                : null;
            return {
              entities,
              tileSize,
              tiles,
              tilesetID,
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
    levels,
    tilesets,
  };
};

export default getWorld;
