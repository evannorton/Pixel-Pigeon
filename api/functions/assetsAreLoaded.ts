import { getTotalAssets } from "pigeon-mode-game-framework/api/functions/getTotalAssets";
import { state } from "pigeon-mode-game-framework/api/state";

export const assetsAreLoaded = (): boolean =>
  state.values.loadedAssets === getTotalAssets();
