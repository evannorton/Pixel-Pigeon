import { Assets, Texture } from "pixi.js";
import { attemptGetWorld } from "./attemptGetWorld";
import { state } from "../state";

export const loadPixiAsset = async (
  path: string,
  isRemote: boolean,
): Promise<Texture> => {
  const currentPath: string = location.pathname.endsWith("/")
    ? location.pathname.substring(0, location.pathname.length - 1)
    : location.pathname.substring(0, location.pathname.lastIndexOf("/"));
  const resolvedPath: string = isRemote ? path : `${currentPath}/${path}`;
  const texture: Texture = await Assets.load(resolvedPath);
  state.setValues({
    loadedAssets: state.values.loadedAssets + 1,
  });
  attemptGetWorld();
  return texture;
};
