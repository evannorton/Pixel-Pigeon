import Definable from "./Definable";
import LevelData from "../interfaces/LevelData";
import state from "../state";

interface Options {
  readonly condition?: () => boolean;
  readonly file: string;
}

class Level extends Definable {
  private _data: LevelData | null = null;
  private readonly _options: Options;

  public constructor(options: Options) {
    super();
    this._options = options;
    fetch(`./levels/${this._options.file}.json`)
      .then((res): void => {
        res
          .json()
          .then((levelData: LevelData): void => {
            this._data = levelData;
            state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
            console.log(this._data);
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((): void => {
        throw new Error(`Level "${this._options.file}" could not be loaded.`);
      });
  }

  public attemptDraw(): void {
    if (
      typeof this._options.condition === "undefined" ||
      this._options.condition()
    ) {
    }
  }
}

export default Level;
