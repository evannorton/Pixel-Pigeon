interface OgmoLevel {
  readonly height: number,
  readonly layers: {
    readonly arrayMode: 1;
    readonly dataCoords2D: [number, number][][];
    readonly exportMode: 1;
    readonly tileset: string;
  }[];
  readonly offsetX: 0;
  readonly offsetY: 0;
  readonly ogmoVersion: "3.4.0";
  readonly width: number,
}

export default OgmoLevel;
