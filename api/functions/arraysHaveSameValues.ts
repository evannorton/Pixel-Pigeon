export const arraysHaveSameValues = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA: unknown[] = [...a].sort();
  const sortedB: unknown[] = [...b].sort();
  for (let i: number = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) {
      return false;
    }
  }
  return true;
};
