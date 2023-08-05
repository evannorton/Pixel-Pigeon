import { state } from "../state";

export const lockCameraToEntity = (entityID: string): void => {
  state.setValues({ cameraLockedEntityID: entityID });
};
