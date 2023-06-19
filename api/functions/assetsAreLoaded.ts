import getTotalAssets from "./getTotalAssets";
import state from "../state";

const assetsAreLoaded = (): boolean => state.values.loadedAssets === getTotalAssets();

export default assetsAreLoaded;
