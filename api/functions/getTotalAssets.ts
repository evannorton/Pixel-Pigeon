import { ImageSource } from "pigeon-mode-game-framework/api/classes/ImageSource";
import { getDefinables } from "pigeon-mode-game-framework/api/functions/getDefinables";
import { state } from "pigeon-mode-game-framework/api/state";

export const getTotalAssets = (): number => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to get total assets before world was loaded.",
    );
  }
  return (
    // Sprites
    getDefinables(ImageSource).size +
    // RetroPixels font
    1
  );
};
