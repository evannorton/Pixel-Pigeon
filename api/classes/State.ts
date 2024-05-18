/**
 * The state class takes in a StateSchema defined as whatever you want it to be. It allows for access anywhere from the program.
 */
export class State<StateSchema> {
  private _values: StateSchema;

  /**
   *
   * @param initialState - The StateSchema that the class will follow
   * @example
   * ```ts
   *  interface StateSchema {
      myString: string | null;
      favoriteNumber:  number;
    }

    const defaultState: StateSchema = {
      myString: null,
      favoriteNumber: 3,
    };

    export const state: State<StateSchema> = new State(defaultState);
   * ```
   */
  public constructor(initialState: StateSchema) {
    this._values = initialState;
  }

  /**
   * @example
   * ```ts
   * console.log(state.values.favoriteNumber); // 3
   * ```
   */
  public get values(): StateSchema {
    return { ...this._values };
  }

  /**
   * Set the values in state to be accessed anywhere
   * @param values - The partial values of StateSchema to change
   *
   * @example
   * ```ts
   * const favoriteNumber: number = 5;
   * state.setValues({ favoriteNumber });
   * ```
   */
  public setValues(values: Partial<StateSchema>): void {
    const newValues: Partial<StateSchema> = {};
    for (const key in values) {
      if (typeof values[key] !== "undefined") {
        newValues[key] = values[key];
      }
    }
    this._values = {
      ...this._values,
      ...newValues,
    };
  }
}
