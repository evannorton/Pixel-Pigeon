import { InputCollection } from "../classes/InputCollection";
import { KeyboardButton } from "../types/KeyboardButton";
import { getDefinable } from "../functions/getDefinable";
import { state } from "../state";

export const addInputBodyElement: HTMLDivElement =
  document.createElement("div");
addInputBodyElement.tabIndex = -1;
addInputBodyElement.style.alignItems = "center";
addInputBodyElement.style.border = "0.1em solid white";
addInputBodyElement.style.display = "flex";
addInputBodyElement.style.justifyContent = "center";
addInputBodyElement.style.height = "6em";
addInputBodyElement.style.outline = "none";
addInputBodyElement.style.overflowY = "auto";
addInputBodyElement.style.padding = "1em";

export const addInputBodyTextElement: HTMLSpanElement =
  document.createElement("span");
addInputBodyElement.appendChild(addInputBodyTextElement);
addInputBodyElement.addEventListener(
  "keydown",
  (keyboardEvent: KeyboardEvent): void => {
    if (state.values.addInputCollectionID === null) {
      throw new Error(
        "An attempt was made to add a keyboard input with no add input collection ID.",
      );
    }
    keyboardEvent.preventDefault();
    addInputBodyTextElement.innerText = `Keyboard: ${keyboardEvent.code}`;
    const inputCollection: InputCollection | null = getDefinable(
      InputCollection,
      state.values.addInputCollectionID,
    );
    const keyboardButton: KeyboardButton = {
      numlock: false,
      value: keyboardEvent.code,
      withoutNumlock: false,
    };
    inputCollection.updateAddingKeyboardButton(keyboardButton);
  },
);
addInputBodyElement.addEventListener(
  "mousedown",
  (mouseEvent: MouseEvent): void => {
    if (state.values.addInputCollectionID === null) {
      throw new Error(
        "An attempt was made to add a mouse input with no add input collection ID.",
      );
    }
    addInputBodyTextElement.innerText = `Mouse: ${mouseEvent.button}`;
    const inputCollection: InputCollection | null = getDefinable(
      InputCollection,
      state.values.addInputCollectionID,
    );
    inputCollection.updateAddingMouseButton(mouseEvent.button);
  },
);
