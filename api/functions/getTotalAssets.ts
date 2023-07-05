import ImageSource from "../classes/ImageSource";
import getDefinables from "./getDefinables";
import state from "../state";

const getTotalAssets = (): number => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to get total assets before world was loaded."
    );
  }
  return (
    // Sprites
    getDefinables(ImageSource).size +
    // RetroPixels font
    1
  );
};

export default getTotalAssets;
