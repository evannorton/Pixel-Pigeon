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
