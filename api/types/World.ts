interface WorldEntity {
  readonly color: string;
}
interface WorldLevelLayerEntityInstance {
  readonly entityID: string;
  readonly height: number;
  readonly id: string;
  readonly spriteInstanceID: string | null;
  readonly width: number;
  x: number;
  xVelocity: number;
  y: number;
  yVelocity: number;
}
interface WorldLevelLayer {
  readonly entityInstances: WorldLevelLayerEntityInstance[];
  readonly id: string;
  readonly tileSize: number;
  readonly tiles: {
    readonly id: number;
    readonly x: number;
    readonly y: number;
  }[];
  readonly tilesetID: string | null;
}
interface WorldLevel {
  readonly height: number;
  readonly layers: WorldLevelLayer[];
  readonly width: number;
}
interface WorldTileset {
  readonly height: number;
  readonly imageSourceID: string;
  readonly tileSize: number;
  readonly tiles: WorldTilesetTile[];
  readonly width: number;
}
interface WorldTilesetTile {
  readonly id: number;
  readonly isCollidable: boolean;
}
interface World {
  readonly entities: Map<string, WorldEntity>;
  readonly levels: Map<string, WorldLevel>;
  readonly tilesets: Map<string, WorldTileset>;
}

export default World;
export {
  WorldEntity,
  WorldLevelLayerEntityInstance as WorldLevelLayerEntity,
  WorldLevelLayer,
  WorldLevel,
  WorldTileset,
  WorldTilesetTile,
};
