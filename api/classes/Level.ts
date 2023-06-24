import Definable from "./Definable";
import OgmoLevel from "../interfaces/ogmo/OgmoLevel";
import Tileset from "./Tileset";
import getDefinable from "../functions/getDefinable";
import getToken from "../functions/getToken";
import state from "../state";

interface LevelOptions {
  readonly condition?: () => boolean;
  readonly file: string;
}
interface LevelLayer {
  readonly tileCoords: ({
    readonly x: number;
    readonly y: number;
  } | null)[][];
  readonly tilesetID: string | null;
}
class Level extends Definable {
  private readonly _options: LevelOptions;
  private _layers: LevelLayer[] = [];

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
      for (const layer of this._layers) {
        if (layer.tilesetID !== null) {
          const tileset: Tileset = getDefinable(Tileset, layer.tilesetID);
          layer.tileCoords.forEach(
            (rowTileCoords: LevelLayer["tileCoords"][0], y: number): void => {
              rowTileCoords.forEach(
                (
                  tileCoords: LevelLayer["tileCoords"][0][0],
                  x: number
                ): void => {
                  if (tileCoords !== null) {
                    tileset.drawTile(tileCoords.x, tileCoords.y, x, y);
                  }
                }
              );
            }
          );
        }
      }
    }
  }

  public loadOgmoLevel(): void {
    fetch(`./levels/${this._options.file}.json`)
      .then((response: Response): void => {
        response
          .json()
          .then((ogmoLevel: OgmoLevel): void => {
            state.setValues({ loadedAssets: state.values.loadedAssets + 1 });
            this._layers = ogmoLevel.layers.map(
              (ogmoLevelLayer: OgmoLevel["layers"][0]): LevelLayer => ({
                tileCoords:
                  ogmoLevelLayer.dataCoords2D?.map(
                    (
                      dataCoords2D: ([number, number] | [-1])[]
                    ): LevelLayer["tileCoords"][0] =>
                      dataCoords2D.map(
                        (
                          coords: [number, number] | [-1]
                        ): LevelLayer["tileCoords"][0][0] =>
                          typeof coords[1] === "number"
                            ? {
                                x: coords[0],
                                y: coords[1],
                              }
                            : null
                      )
                  ) ?? [],
                tilesetID: ogmoLevelLayer.tileset?.toLowerCase() ?? null,
              })
            );
          })
          .catch((error: Error): void => {
            throw error;
          });
      })
      .catch((): void => {
        throw new Error(`Level "${this._options.file}" could not be loaded.`);
      });
  }
}

export default Level;
