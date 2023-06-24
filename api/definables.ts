import Definable from "./classes/Definable";

const definables: Map<string, Map<string, Definable>> = new Map();
(
  window as unknown as {
    definables: Map<string, Map<string, Definable>>;
  }
).definables = definables;

export default definables;
