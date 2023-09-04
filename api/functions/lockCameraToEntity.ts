import { state } from "pigeon-mode-game-framework/api/state";

/**
 * Locks the camera to follow the entity
 * @param entityID - The entity to lock the camera to 
 */
export const lockCameraToEntity = (entityID: string): void => {
  state.setValues({ cameraLockedEntityID: entityID });
};
