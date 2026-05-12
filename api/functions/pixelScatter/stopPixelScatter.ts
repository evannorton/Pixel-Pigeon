import { state } from "../../state";

export const stopPixelScatter = (): void => {
  state.setValues({
    pixelScatter: null,
  });
};
