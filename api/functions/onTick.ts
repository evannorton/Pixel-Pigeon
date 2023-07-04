import state from "../state";

const onTick = (callback: () => void): void => {
  state.setValues({
    onTickCallbacks: [...state.values.onTickCallbacks, callback],
  });
};

export default onTick;
