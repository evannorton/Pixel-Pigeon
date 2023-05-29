import Sprite from "../classes/Sprite";
import getDefinables from "./getDefinables";

const getTotalAssets = (): number => getDefinables(Sprite).size + 1;

export default getTotalAssets;
