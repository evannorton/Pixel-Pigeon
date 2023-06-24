interface OgmoLevel {
  readonly height: number;
  readonly layers: OgmoLevelLayer[];
  readonly offsetX: 0;
  readonly offsetY: 0;
  readonly ogmoVersion: "3.4.0";
  readonly width: number;
}
interface OgmoLevelLayer {
  readonly arrayMode?: 1;
  readonly dataCoords2D?: OgmoLevelLayerDataCoords2D[][];
  readonly entities?: OgmoLevelLayerEntity[];
  readonly exportMode?: 1;
  readonly tileset?: string;
}
type OgmoLevelLayerDataCoords2D = [number, number] | [-1];
interface OgmoLevelLayerEntity {
  readonly id: number;
  readonly originX: 0;
  readonly originY: 0;
  readonly x: number;
  readonly y: number;
}

export default OgmoLevel;
export { OgmoLevelLayer, OgmoLevelLayerEntity, OgmoLevelLayerDataCoords2D };
