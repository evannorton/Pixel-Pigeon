interface OgmoProject {
  readonly anglesRadians: true,
  readonly directoryDepth: 1,
  readonly defaultExportMode: ".json",
  readonly levelPaths: string[];
  readonly ogmoVersion: "3.4.0",
  readonly tilesets: {
    readonly label: string;
    readonly path: string;
    readonly tileHeight: number;
    readonly tileMarginX: 0;
    readonly tileMarginY: 0;
    readonly tileSeparationX: 0;
    readonly tileSeparationY: 0;
    readonly tileWidth: number;
  }[];
}

export default OgmoProject;
