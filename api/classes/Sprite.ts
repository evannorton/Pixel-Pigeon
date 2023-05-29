import Definable from "./Definable";
import state from "../state";
import { Assets } from "pixi.js";

class Sprite extends Definable {
  public constructor(slug: string) {
    super(slug);
    Assets.load(`./images/${slug}.png`).then((): void => {
      state.loadedAssets++;
    });
  }
}

export default Sprite;