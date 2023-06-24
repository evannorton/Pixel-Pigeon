import Level from "../classes/Level";
import Sprite from "../classes/Sprite";
import Tileset from "../classes/Tileset";
import getDefinables from "./getDefinables";

const getTotalAssets = (): number =>
  // Sprites
  getDefinables(Sprite).size +
  // Levels
  getDefinables(Level).size +
  // Tilesets
  getDefinables(Tileset).size +
  // RetroPixels font
  1 +
  // Ogmo project
  1;

export default getTotalAssets;
