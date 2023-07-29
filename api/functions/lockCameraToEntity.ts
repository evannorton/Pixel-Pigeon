import { state } from "pigeon-mode-game-framework/api/state";

export const lockCameraToEntity = (entityID: string): void => {
  state.setValues({ cameraLockedEntityID: entityID });
};
