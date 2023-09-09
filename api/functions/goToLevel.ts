import { state } from "../state";

/**
 * Switches the current active level to the provided level, levels must be made in LDTK
 *
 * @param levelID - A string of the ID of the level as defined in LDTK
 *
 * @example
 * Changes the level to the default name level of LDTK
 * ```ts
 * goToLevel("level_0");
 * ```
 */
export const goToLevel = (levelID: string): void => {
  state.setValues({ levelID });
};
