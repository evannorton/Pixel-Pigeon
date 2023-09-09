import { AudioSource } from "../classes/AudioSource";
import { ImageSource } from "../classes/ImageSource";
import { getDefinables } from "./getDefinables";
import { state } from "../state";

export const getTotalAssets = (): number => {
  if (state.values.world === null) {
    throw new Error(
      "An attempt was made to get total assets before world was loaded.",
    );
  }
  return (
    // Audio sources
    getDefinables(AudioSource).size +
    // Image sources
    getDefinables(ImageSource).size +
    // RetroPixels font
    1
  );
};
