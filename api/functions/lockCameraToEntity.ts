import state from "../state";

const lockCameraToEntity = (entityID: string): void => {
  state.setValues({ cameraLockedEntityID: entityID });
};

export default lockCameraToEntity;
