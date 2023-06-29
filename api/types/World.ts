import { Texture } from "pixi.js";

export interface WorldEntity {
  readonly color: string;
}
export interface WorldLevel {
  readonly layers: {
    readonly entities: {
      readonly height: number;
      readonly id: string;
      readonly width: number;
      readonly x: number;
      readonly y: number;
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
  readonly entities: Map<string, WorldEntity>;
  readonly levels: Map<string, WorldLevel>;
  readonly tilesets: Map<string, WorldTileset>;
}

export default World;
