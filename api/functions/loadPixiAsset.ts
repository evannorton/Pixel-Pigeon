import { Assets, Texture } from "pixi.js";
import { attemptLoadWorld } from "./attemptLoadWorld";
import { state } from "../state";

export const loadPixiAsset = async (path: string): Promise<Texture> => {
  const currentPath: string = location.pathname.endsWith("/")
    ? location.pathname.substring(0, location.pathname.length - 1)
    : location.pathname.substring(0, location.pathname.lastIndexOf("/"));
  const texture: Texture = await Assets.load(`${currentPath}/${path}`);
  state.setValues({
    loadedAssets: state.values.loadedAssets + 1,
  });
  attemptLoadWorld().catch((error: unknown): void => {
    throw error;
  });
  return texture;
};
