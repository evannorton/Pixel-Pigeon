import { HUDElementReferences } from "../types/HUDElementReferences";
import { removeButton } from "../classes/Button";
import { removeEllipse } from "../classes/Ellipse";
import { removeLabel } from "../classes/Label";
import { removeNineSlice } from "../classes/NineSlice";
import { removeQuadrilateral } from "../classes/Quadrilateral";
import { removeSprite } from "../classes/Sprite";

export const removeHUDElements = (
  hudElementReferences: HUDElementReferences,
): void => {
  for (const buttonID of hudElementReferences.buttonIDs ?? []) {
    removeButton(buttonID);
  }
  for (const ellipseID of hudElementReferences.ellipseIDs ?? []) {
    removeEllipse(ellipseID);
  }
  for (const labelID of hudElementReferences.labelIDs ?? []) {
    removeLabel(labelID);
  }
  for (const nineSliceID of hudElementReferences.nineSliceIDs ?? []) {
    removeNineSlice(nineSliceID);
  }
  for (const quadrilateralID of hudElementReferences.quadrilateralIDs ?? []) {
    removeQuadrilateral(quadrilateralID);
  }
  for (const spriteID of hudElementReferences.spriteIDs ?? []) {
    removeSprite(spriteID);
  }
};
