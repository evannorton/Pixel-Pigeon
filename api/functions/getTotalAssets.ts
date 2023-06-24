import Sprite from "../classes/Sprite";
import getDefinables from "./getDefinables";

const getTotalAssets = (): number =>
  // Sprites
  getDefinables(Sprite).size +
  // RetroPixels font
  1;

export default getTotalAssets;
