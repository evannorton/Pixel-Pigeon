import Definable from "./Definable";
import OgmoLevel from "../interfaces/ogmo/OgmoLevel";
import getToken from "../functions/getToken";
import state from "../state";

interface LevelOptions {
  readonly condition?: () => boolean;
  readonly file: string;
}

class Level extends Definable {
  private readonly _options: LevelOptions;

  public constructor(options: LevelOptions) {
    if (state.values.isInitialized) {
      throw new Error(
        "A Definable was attempted to be constructed after initialization."
      );
    }
    super(getToken());
    this._options = options;
  }

  public attemptDraw(): void {
    if (
      typeof this._options.condition === "undefined" ||
      this._options.condition()
    ) {
    }
  }

  public loadOgmoLevel(): void {
    fetch(`./levels/${this._options.file}.json`)
      .then((res): void => {
        res
          .json()
          .then((ogmoLevel: OgmoLevel): void => {
            state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
            console.log(ogmoLevel);
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((): void => {
        throw new Error(`Level "${this._options.file}" could not be loaded.`);
      });
  }
}

export default Level;
