import { LDTK } from "../types/LDTK";
import { assetsAreLoaded } from "./assetsAreLoaded";
import { getWorld } from "./getWorld";
import { state } from "../state";

export const attemptLoadWorld = async (): Promise<void> => {
  if (assetsAreLoaded()) {
    const ldtkRes: Response = await fetch("./project.ldtk");
    const ldtk: LDTK = (await ldtkRes.json()) as LDTK;
    state.setValues({
      world: getWorld(ldtk),
    });
  }
};
