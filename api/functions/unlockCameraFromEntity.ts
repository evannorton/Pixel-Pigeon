import { state } from "../state";

export const unlockCameraFromEntity = (): void => {
  state.setValues({
    cameraLockedEntityID: null,
  });
};
