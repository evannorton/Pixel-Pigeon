import { CollisionData } from "./types/CollisionData";
import {
  ConnectToSocketioServerOptions,
  connectToSocketioServer,
} from "./functions/socketio/connectToSocketioServer";
import {
  CreateAchievementOptions,
  createAchievement,
  unlockAchievement,
} from "./classes/Achievement";
import {
  CreateButtonOptions,
  CreateButtonOptionsCoordinates,
  createButton,
  removeButton,
} from "./classes/Button";
import {
  CreateEllipseOptions,
  CreateEllipseOptionsCoordinates,
  createEllipse,
  removeEllipse,
} from "./classes/Ellipse";
import {
  CreateEntityOptions,
  GetEntityCalculatedPathOptions,
  MoveEntityOptions,
  PathEntityOptions,
  addEntityEllipse,
  addEntityQuadrilateral,
  addEntitySprite,
  createEntity,
  getEntityCalculatedPath,
  getEntityFieldValue,
  getEntityPosition,
  isEntityPathing,
  moveEntity,
  pathEntity,
  removeEntity,
  removeEntitySprite,
  setEntityBlockingPosition,
  setEntityLevel,
  setEntityPosition,
  setEntityZIndex,
  stopEntity,
} from "./classes/Entity";
import {
  CreateInputCollectionOptions,
  CreateInputCollectionOptionsKeyboardButton,
  createInputCollection,
} from "./classes/InputCollection";
import {
  CreateInputPressHandlerOptions,
  createInputPressHandler,
} from "./classes/InputPressHandler";
import {
  CreateInputTickHandlerOptions,
  CreateInputTickHandlerOptionsGroup,
  createInputTickHandler,
} from "./classes/InputTickHandler";
import {
  CreateLabelOptions,
  CreateLabelOptionsCoordinates,
  CreateLabelOptionsText,
  CreateLabelOptionsTextTrim,
  createLabel,
  removeLabel,
} from "./classes/Label";
import {
  CreateLevelOptions,
  CreateLevelOptionsLayer,
  CreateLevelOptionsLayerTile,
  createLevel,
} from "./functions/createLevel";
import {
  CreateNineSliceOptions,
  CreateNineSliceOptionsCoordinates,
  createNineSlice,
  removeNineSlice,
} from "./classes/NineSlice";
import {
  CreateQuadrilateralOptions,
  CreateQuadrilateralOptionsCoordinates,
  createQuadrilateral,
  removeQuadrilateral,
} from "./classes/Quadrilateral";
import {
  CreateSpriteOptions,
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  CreateSpriteOptionsCoordinates,
  CreateSpriteOptionsRecolor,
  createSprite,
  removeSprite,
} from "./classes/Sprite";
import {
  CreateTilesetOptions,
  CreateTilesetOptionsTile,
  CreateTilesetOptionsTileAnimationFrame,
  createTileset,
} from "./functions/createTileset";
import {
  CreateVolumeChannelOptions,
  SetVolumeChannelVolumeOptions,
  createVolumeChannel,
  setVolumeChannelVolume,
} from "./classes/VolumeChannel";
import {
  EmitToSocketIOServerOptions,
  emitToSocketioServer,
} from "./functions/socketio/emitToSocketioServer";
import {
  EntityButton,
  EntityCollidable,
  EntityEllipse,
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
} from "./types/World";
import { GetEntityIDsOptions, getEntityIDs } from "./functions/getEntityIDs";
import {
  GetRectangleCollisionDataOptions,
  getRectangleCollisionData,
} from "./functions/getRectangleCollisionData";
import {
  IsRectangleInLevelOptions,
  isRectangleInLevel,
} from "./functions/isRectangleInLevel";
import {
  ListenToSocketioEventOptions,
  listenToSocketioEvent,
} from "./functions/socketio/listenToSocketioEvent";
import {
  MakeHTTPRequestOptions,
  makeHTTPRequest,
} from "./functions/makeHTTPRequest";
import { NumLock } from "./types/NumLock";
import { OverlapData } from "./types/OverlapData";
import { PathingEntityExclusion } from "./types/PathingEntityExclusion";
import {
  PlayAudioSourceOptions,
  playAudioSource,
  stopAudioSource,
} from "./classes/AudioSource";
import { Rectangle } from "./types/Rectangle";
import { Scriptable } from "./types/Scriptable";
import { SetMainVolumeOptions, setMainVolume } from "./functions/setMainVolume";
import { State } from "./classes/State";
import { TextStyleAlign } from "pixi.js";
import { exitLevel } from "./functions/exitLevel";
import { getActiveLevelID } from "./functions/getActiveLevelID";
import { getCurrentTime } from "./functions/getCurrentTime";
import { getDeltaTime } from "./functions/getDeltaTime";
import { getEntityLevelID } from "./functions/getEntityLevelID";
import { getEnvironmentVariable } from "./functions/getEnvironmentVariable";
import { getGameHeight } from "./functions/getGameHeight";
import { getGameWidth } from "./functions/getGameWidth";
import { getInputTickHandlerGroupID } from "./functions/getInputTickHandlerGroupID";
import { goToLevel } from "./functions/goToLevel";
import { handleError } from "./functions/handleError";
import { initialize } from "./functions/initialize";
import { lockCameraToEntity } from "./functions/lockCameraToEntity";
import { muteVolume } from "./functions/muteVolume";
import { onError } from "./functions/onError";
import { onRun } from "./functions/onRun";
import { onTick } from "./functions/onTick";
import { onWindowMessage } from "./functions/onWindowMessage";
import { openURL } from "./functions/openURL";
import { postWindowMessage } from "./functions/postWindowMessage";
import { setPauseMenuCondition } from "./functions/setPauseMenuCondition";
import { takeScreenshot } from "./functions/takeScreenshot";
import { unlockCameraFromEntity } from "./functions/unlockCameraFromEntity";
import { unmuteVolume } from "./functions/unmuteVolume";

export {
  addEntityEllipse,
  addEntityQuadrilateral,
  addEntitySprite,
  CollisionData,
  connectToSocketioServer,
  ConnectToSocketioServerOptions,
  createAchievement,
  CreateAchievementOptions,
  createButton,
  CreateButtonOptions,
  CreateButtonOptionsCoordinates,
  createEllipse,
  CreateEllipseOptions,
  CreateEllipseOptionsCoordinates,
  createEntity,
  CreateEntityOptions,
  createInputCollection,
  CreateInputCollectionOptions,
  CreateInputCollectionOptionsKeyboardButton,
  createInputPressHandler,
  CreateInputPressHandlerOptions,
  createInputTickHandler,
  CreateInputTickHandlerOptions,
  CreateInputTickHandlerOptionsGroup,
  createLabel,
  CreateLabelOptions,
  CreateLabelOptionsCoordinates,
  CreateLabelOptionsText,
  CreateLabelOptionsTextTrim,
  createLevel,
  CreateLevelOptions,
  CreateLevelOptionsLayer,
  CreateLevelOptionsLayerTile,
  createNineSlice,
  CreateNineSliceOptions,
  CreateNineSliceOptionsCoordinates,
  createQuadrilateral,
  CreateQuadrilateralOptions,
  CreateQuadrilateralOptionsCoordinates,
  createSprite,
  CreateSpriteOptions,
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsAnimationFrame,
  CreateSpriteOptionsCoordinates,
  CreateSpriteOptionsRecolor,
  createTileset,
  CreateTilesetOptions,
  CreateTilesetOptionsTile,
  CreateTilesetOptionsTileAnimationFrame,
  createVolumeChannel,
  CreateVolumeChannelOptions,
  emitToSocketioServer,
  EmitToSocketIOServerOptions,
  EntityButton,
  EntityCollidable,
  EntityEllipse,
  EntityPosition,
  EntityQuadrilateral,
  EntitySprite,
  exitLevel,
  getActiveLevelID,
  getCurrentTime,
  getDeltaTime,
  getEntityCalculatedPath,
  GetEntityCalculatedPathOptions,
  getEntityFieldValue,
  getEntityIDs,
  GetEntityIDsOptions,
  getEntityLevelID,
  getEntityPosition,
  getEnvironmentVariable,
  getGameHeight,
  getGameWidth,
  getInputTickHandlerGroupID,
  getRectangleCollisionData,
  GetRectangleCollisionDataOptions,
  goToLevel,
  handleError,
  initialize,
  isEntityPathing,
  isRectangleInLevel,
  IsRectangleInLevelOptions,
  listenToSocketioEvent,
  ListenToSocketioEventOptions,
  lockCameraToEntity,
  makeHTTPRequest,
  MakeHTTPRequestOptions,
  moveEntity,
  MoveEntityOptions,
  NumLock,
  onError,
  onRun,
  onTick,
  onWindowMessage,
  openURL,
  OverlapData,
  pathEntity,
  PathEntityOptions,
  PathingEntityExclusion,
  playAudioSource,
  PlayAudioSourceOptions,
  postWindowMessage,
  Rectangle,
  removeButton,
  removeEllipse,
  removeEntity,
  removeEntitySprite,
  removeLabel,
  removeNineSlice,
  removeQuadrilateral,
  removeSprite,
  Scriptable,
  setEntityBlockingPosition,
  setEntityLevel,
  setEntityPosition,
  setEntityZIndex,
  setPauseMenuCondition,
  State,
  stopAudioSource,
  stopEntity,
  takeScreenshot,
  TextStyleAlign,
  unlockAchievement,
  unlockCameraFromEntity,
  unmuteVolume,
  muteVolume,
  setMainVolume,
  SetMainVolumeOptions,
  setVolumeChannelVolume,
  SetVolumeChannelVolumeOptions,
};
