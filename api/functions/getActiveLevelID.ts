import { state } from "../state";

export const getActiveLevelID = (): string | null => state.values.levelID;
