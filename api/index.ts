export { State } from "./classes/State";
export { createInputPressHandler } from "./classes/InputPressHandler";
export { createInputTickHandler } from "./classes/InputTickHandler";
export { createSprite } from "./classes/Sprite";
export {
  createSpriteInstance,
  playSpriteInstanceAnimation,
  removeSpriteInstance,
} from "./classes/SpriteInstance";
export { despawnEntityInstance } from "./functions/despawnEntityInstance";
export { disableEntityInstanceCollision } from "./functions/disableEntityInstanceCollision";
export { getCurrentTime } from "./functions/getCurrentTime";
export {
  getEntityInstanceData,
  EntityInstanceData,
} from "./functions/getEntityInstanceData";
export { getInputTickHandlerGroupID } from "./functions/getInputTickHandlerGroupID";
export { goToLevel } from "./functions/goToLevel";
export { init } from "./functions/init";
export { isEntityInstanceMoving } from "./functions/isEntityInstanceMoving";
export { lockCameraToEntityInstance } from "./functions/lockCameraToEntityInstance";
export { moveEntityInstance } from "./functions/moveEntityInstance";
export { onTick } from "./functions/onTick";
export { spawnEntityInstance } from "./functions/spawnEntityInstance";
export { stopEntityInstance } from "./functions/stopEntityInstance";
