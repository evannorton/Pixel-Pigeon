// Body element
export const addInputBodyElement: HTMLDivElement =
  document.createElement("div");
// Box elements
export const addInputBodyBoxElement: HTMLDivElement =
  document.createElement("div");
addInputBodyBoxElement.tabIndex = 0;
addInputBodyBoxElement.style.alignItems = "center";
addInputBodyBoxElement.style.border = "0.1em solid white";
addInputBodyBoxElement.style.display = "flex";
addInputBodyBoxElement.style.justifyContent = "center";
addInputBodyBoxElement.style.height = "6em";
addInputBodyBoxElement.style.marginBottom = "1em";
addInputBodyBoxElement.style.outline = "none";
addInputBodyBoxElement.style.overflowY = "auto";
addInputBodyBoxElement.style.padding = "1.25em";
addInputBodyElement.appendChild(addInputBodyBoxElement);

export const addInputBodyBoxTextElement: HTMLSpanElement =
  document.createElement("span");
addInputBodyBoxElement.appendChild(addInputBodyBoxTextElement);
// Numlock elements
const addInputBodyNumlockElement: HTMLDivElement =
  document.createElement("div");
addInputBodyElement.appendChild(addInputBodyNumlockElement);

// Numlock with elements
export const addInputBodyNumlockWithElement: HTMLDivElement =
  document.createElement("div");
addInputBodyNumlockWithElement.style.marginBottom = "0.25em";
addInputBodyNumlockWithElement.style.display = "flex";
addInputBodyNumlockWithElement.style.justifyContent = "center";
addInputBodyNumlockWithElement.style.alignItems = "center";

export const addInputBodyNumlockWithInputElement: HTMLInputElement =
  document.createElement("input");
addInputBodyNumlockWithInputElement.id = "numlock-with";
addInputBodyNumlockWithInputElement.name = "numlock-with";
addInputBodyNumlockWithInputElement.type = "checkbox";
addInputBodyNumlockWithInputElement.style.marginRight = "0.5em";
addInputBodyNumlockWithInputElement.style.height = "0.85em";
addInputBodyNumlockWithInputElement.style.width = "0.85em";
addInputBodyNumlockWithElement.appendChild(addInputBodyNumlockWithInputElement);
const addInputBodyNumlockWithLabelElement: HTMLLabelElement =
  document.createElement("label");
addInputBodyNumlockWithLabelElement.htmlFor = "numlock-with";
addInputBodyNumlockWithLabelElement.innerText = "With NumLock";
addInputBodyNumlockWithElement.appendChild(addInputBodyNumlockWithLabelElement);
addInputBodyNumlockElement.appendChild(addInputBodyNumlockWithElement);

// Numlock without elements
export const addInputBodyNumlockWithoutElement: HTMLDivElement =
  document.createElement("div");
addInputBodyNumlockWithoutElement.style.display = "flex";
addInputBodyNumlockWithoutElement.style.justifyContent = "center";
addInputBodyNumlockWithoutElement.style.alignItems = "center";

export const addInputBodyNumlockWithoutInputElement: HTMLInputElement =
  document.createElement("input");
addInputBodyNumlockWithoutInputElement.id = "numlock-without";
addInputBodyNumlockWithoutInputElement.name = "numlock-without";
addInputBodyNumlockWithoutInputElement.type = "checkbox";
addInputBodyNumlockWithoutInputElement.style.marginRight = "0.5em";
addInputBodyNumlockWithoutInputElement.style.height = "0.85em";
addInputBodyNumlockWithoutInputElement.style.width = "0.85em";
addInputBodyNumlockWithoutElement.appendChild(
  addInputBodyNumlockWithoutInputElement,
);
const addInputBodyNumlockWithoutLabelElement: HTMLLabelElement =
  document.createElement("label");
addInputBodyNumlockWithoutLabelElement.htmlFor = "numlock-without";
addInputBodyNumlockWithoutLabelElement.innerText = "Without NumLock";
addInputBodyNumlockWithoutElement.appendChild(
  addInputBodyNumlockWithoutLabelElement,
);
addInputBodyNumlockElement.appendChild(addInputBodyNumlockWithoutElement);
