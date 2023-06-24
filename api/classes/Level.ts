import Definable from "./Definable";

interface Options {
  readonly condition?: () => boolean;
  readonly file: string;
}

class Level extends Definable {
  private readonly _options: Options;

  public constructor(options: Options) {
    super();
    this._options = options;
    fetch(`./levels/${this._options.file}.json`)
      .then((res): void => {
        res
          .json()
          .then((json): void => {
            console.log(json);
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
