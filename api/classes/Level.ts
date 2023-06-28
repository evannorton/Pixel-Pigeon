import Definable from "./Definable";
import state from "../state";

interface LevelOptions {
  readonly id: string;
}
class Level extends Definable {
  private readonly _options: LevelOptions;

  public constructor(options: LevelOptions) {
    super(options.id);
    this._options = options;
  }

  public activate(): void {
    state.setValues({ activeLevelID: this._options.id });
  }
}

export default Level;
