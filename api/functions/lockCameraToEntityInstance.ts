import { state } from "../state";

export const lockCameraToEntityInstance = (entityInstanceID: string): void => {
  state.setValues({ cameraLockedEntityInstanceID: entityInstanceID });
};
