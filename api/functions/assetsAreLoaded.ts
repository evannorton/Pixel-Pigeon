import getTotalAssets from "./getTotalAssets";
import state from "../state";

const assetsAreLoaded = (): boolean => state.loadedAssets === getTotalAssets();

export default assetsAreLoaded;
