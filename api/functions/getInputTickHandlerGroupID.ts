import { InputTickHandler } from "pigeon-mode-game-framework/api/classes/InputTickHandler";
import { getDefinable } from "pigeon-mode-game-framework/api/functions/getDefinable";

export const getInputTickHandlerGroupID = <GroupID extends string>(
  inputTickHandlerID: string,
): GroupID | null =>
  getDefinable<InputTickHandler<GroupID>>(
    InputTickHandler,
    inputTickHandlerID,
  ).getGroupID();
