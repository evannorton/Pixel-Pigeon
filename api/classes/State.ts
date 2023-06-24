class State<StateSchema> {
  private _values: StateSchema;

  constructor(initialState: StateSchema) {
    this._values = initialState;
  }

  public get values(): StateSchema {
    return { ...this._values };
  }

  public setValues(values: Partial<StateSchema>): void {
    this._values = {
      ...this._values,
      ...values,
    };
  }
}

export default State;
