import { addInputBodyBoxElement } from "../elements/addInputBodyElement";

export const updateGamepadBinding = (): void => {
  if (document.activeElement === addInputBodyBoxElement) {
    console.log("hi");
  }
};
