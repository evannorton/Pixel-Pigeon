import Definable from "../classes/Definable";
import getDefinables from "./getDefinables";

const getDefinable = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
  id: string
): T => {
  const definable: T | undefined = getDefinables(prototype).get(id);
  if (typeof definable === "undefined") {
    throw new Error(`${prototype.name} "${id}" does not exist.`);
  }
  return definable;
};

export default getDefinable;
