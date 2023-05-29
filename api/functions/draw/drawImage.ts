import { Rectangle, Sprite as PixiSprite, Texture } from "pixi.js";
import Sprite from "../../classes/Sprite";
import app from "../../app";
import getDefinable from "../getDefinable";
import config from "pigeon-mode-game-library/api/config";

const drawImage = (spriteSlug: string, opacity: number, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, x: number, y: number, width: number, height: number): void => {
  const sprite = getDefinable(Sprite, spriteSlug);
  const chopX: number = Math.max(x * -1, 0);
  const chopY: number = Math.max(y * -1, 0);
  const adjustedX: number = Math.max(x, 0);
  const adjustedY: number = Math.max(y, 0);
  const adjustedWidth: number = Math.min(width - chopX, config.width - adjustedX);
  const adjustedHeight: number = Math.min(height - chopY, config.height - adjustedY);
  const adjustedSourceX: number = chopX + sourceX;
  const adjustedSourceY: number = chopY + sourceY;
  const adjustedSourceWidth: number = Math.min(sourceWidth - chopX, adjustedWidth);
  const adjustedSourceHeight: number = Math.min(sourceHeight - chopY, adjustedHeight);
  const pixiSprite: PixiSprite = new PixiSprite(new Texture(sprite.texture.baseTexture, new Rectangle(adjustedSourceX, adjustedSourceY, adjustedSourceWidth, adjustedSourceHeight)));
  pixiSprite.x = adjustedX;
  pixiSprite.y = adjustedY;
  pixiSprite.width = adjustedWidth;
  pixiSprite.height = adjustedHeight;
  pixiSprite.alpha = opacity;
  app.stage.addChild(pixiSprite);
};

export default drawImage;