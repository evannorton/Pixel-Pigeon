import { Texture } from "pixi.js";

interface WorldEntity {
  readonly color: string;
}
interface WorldLayerEntity {
  readonly height: number;
  readonly id: string;
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
      readonly sourceX: number;
      readonly sourceY: number;
      readonly x: number;
      readonly y: number;
    }[];
    readonly tilesetID: string | null;
  }[];
}
interface WorldTileset {
  readonly imagePath: string;
  texture: Texture | null;
  readonly tileSize: number;
}
interface World {
  readonly entities: Map<string, WorldEntity>;
  readonly levels: Map<string, WorldLevel>;
  readonly tilesets: Map<string, WorldTileset>;
}

export default World;
export { WorldEntity, WorldLayerEntity, WorldLevel, WorldTileset };
