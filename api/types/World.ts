import { Texture } from "pixi.js";

export interface WorldLevel {
  readonly layers: {
    readonly entities: {
      readonly id: string;
    }[];
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
export interface WorldTileset {
  readonly imagePath: string;
  texture: Texture | null;
  readonly tileSize: number;
}
interface World {
  readonly levels: Map<string, WorldLevel>;
  readonly tilesets: Map<string, WorldTileset>;
}

export default World;
