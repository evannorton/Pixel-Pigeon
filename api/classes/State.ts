class State<Schema> {
  private _values: Schema;

  constructor(initialState: Schema) {
    this._values = initialState;
  }
  
  public get values(): Schema {
    return { ...this._values};
  }

  public setValues(values: Partial<Schema>): void {
    this._values = {
      ...this._values,
      ...values
    }
  }
}

export default State;