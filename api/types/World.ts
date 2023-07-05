interface WorldEntity {
  readonly color: string;
}
interface WorldLayerEntity {
  readonly height: number;
  readonly id: string;
  readonly spriteImagePath: string | null;
  readonly width: number;
  x: number;
  xVelocity: number;
  y: number;
  yVelocity: number;
}
interface WorldLevel {
  readonly layers: {
    readonly entities: WorldLayerEntity[];
    readonly tileSize: number;
    readonly tiles: {
      readonly id: number;
      readonly x: number;
      readonly y: number;
    }[];
    readonly tilesetID: string | null;
  }[];
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
  WorldLayerEntity,
  WorldLevel,
  WorldTileset,
  WorldTilesetTile,
};
