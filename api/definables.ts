import { Definable } from "pigeon-mode-game-framework/api/classes/Definable";

export const definables: Map<string, Map<string, Definable>> = new Map();
(
  window as unknown as {
    definables: Map<string, Map<string, Definable>>;
  }
).definables = definables;
