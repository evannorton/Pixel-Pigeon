import definables from "../definables";
import Definable from "../classes/Definable";

const getDefinables = <T extends Definable>(prototype: new (...args: any[]) => T): Map<string, T> => {
  const retrievedDefinables: Map<string, T> = new Map;
  definables.get(prototype.name)?.forEach((definable: Definable, slug: string): void => {
    if (definable instanceof prototype) {
      retrievedDefinables.set(slug, definable);
    }
  });
  return retrievedDefinables;
};

export default getDefinables;