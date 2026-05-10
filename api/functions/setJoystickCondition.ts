import { state } from "../state";

export const setJoystickCondition = (
  joystickCondition: () => boolean,
): void => {
  state.setValues({ joystickCondition });
};
