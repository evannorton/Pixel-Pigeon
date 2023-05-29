import getTotalAssets from "pigeon-mode-game-library/api/functions/getTotalAssets";
import state from "../state";

const assetsAreLoaded = (): boolean => state.loadedAssets === getTotalAssets();

export default assetsAreLoaded;