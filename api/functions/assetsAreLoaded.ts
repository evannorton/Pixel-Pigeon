import { getTotalAssets } from "./getTotalAssets";
import { state } from "../state";

export const assetsAreLoaded = (): boolean =>
  state.values.loadedAssets === getTotalAssets();
