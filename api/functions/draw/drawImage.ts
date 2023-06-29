import { Sprite as PixiSprite, Rectangle, Texture } from "pixi.js";
import state from "../../state";

const drawImage = (
  texture: Texture,
  opacity: number,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  if (state.values.app === null) {
    throw new Error(
      "An attempt was made to draw an image before app was created."
    );
  }
  if (state.values.config === null) {
    throw new Error(
      "An attempt was made to draw an image before config was loaded."
    );
  }
  const chopX: number = Math.max(x * -1, 0);
  const chopY: number = Math.max(y * -1, 0);
  const adjustedX: number = Math.max(x, 0);
  const adjustedY: number = Math.max(y, 0);
  const adjustedWidth: number = Math.min(
    width - chopX,
    state.values.config.width - adjustedX
  );
  const adjustedHeight: number = Math.min(
    height - chopY,
    state.values.config.height - adjustedY
  );
  if (adjustedWidth > 0 && adjustedHeight > 0) {
    const adjustedSourceX: number = chopX + sourceX;
    const adjustedSourceY: number = chopY + sourceY;
    const adjustedSourceWidth: number = Math.min(
      sourceWidth - chopX,
      adjustedWidth
    );
    const adjustedSourceHeight: number = Math.min(
      sourceHeight - chopY,
      adjustedHeight
    );
    const pixiSprite: PixiSprite = new PixiSprite(
      new Texture(
        texture.baseTexture,
        new Rectangle(
          adjustedSourceX,
          adjustedSourceY,
          adjustedSourceWidth,
          adjustedSourceHeight
        )
      )
    );
    pixiSprite.x = adjustedX;
    pixiSprite.y = adjustedY;
    pixiSprite.width = adjustedWidth;
    pixiSprite.height = adjustedHeight;
    pixiSprite.alpha = opacity;
    state.values.app.stage.addChild(pixiSprite);
  }
};

export default drawImage;
