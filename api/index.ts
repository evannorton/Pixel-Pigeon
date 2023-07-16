export { default as State } from "./classes/State";
export { createInputPressHandler } from "./classes/InputPressHandler";
export { createInputTickHandler } from "./classes/InputTickHandler";
export { createSprite } from "./classes/Sprite";
export { createSpriteInstance } from "./classes/SpriteInstance";
export {
  default as getEntityInstanceData,
  EntityInstanceData,
} from "pigeon-mode-game-library/api/functions/getEntityInstanceData";
export { default as getInputTickHandlerGroupID } from "./functions/getInputTickHandlerGroupID";
export { default as goToLevel } from "./functions/goToLevel";
export { default as init } from "./functions/init";
export { default as lockCameraToEntity } from "./functions/lockCameraToEntity";
export { default as moveEntityInstance } from "pigeon-mode-game-library/api/functions/moveEntityInstance";
export { default as onTick } from "./functions/onTick";
export { default as playSpriteInstanceAnimation } from "./functions/playSpriteInstanceAnimation";
export { default as spawnEntityInstance } from "./functions/spawnEntityInstance";
export { default as stopEntityInstance } from "./functions/stopEntityInstance";
