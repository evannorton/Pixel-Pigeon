export interface LDTK {
  readonly defs: {
    readonly layers: {
      readonly tilesetDefUid: number | null;
      readonly uid: number;
    }[];
    readonly tilesets: {
      readonly customData: {
        readonly tileId: number;
        readonly data: string;
      }[];
      readonly identifier: string;
      readonly pxHei: number;
      readonly pxWid: number;
      readonly relPath: string;
      readonly tileGridSize: number;
      readonly uid: number;
    }[];
  };
  readonly levels: {
    readonly identifier: string;
    readonly layerInstances: {
      readonly __gridSize: number;
      readonly __identifier: string;
      readonly gridTiles: {
        readonly px: [number, number];
        readonly t: number;
      }[];
      readonly layerDefUid: number;
    }[];
    readonly pxHei: number;
    readonly pxWid: number;
  }[];
}
export interface LDTKTileData {
  readonly ppCollision?: boolean;
}
