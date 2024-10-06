import { InputTickHandler } from "../classes/InputTickHandler";
import { getDefinable } from "definables";

/**
 * Gets the string GroupID that was used to create the {@link createInputTickHandler | InputTickHandler} by supplying the Handler's StringID
 * @param inputTickHandlerID - The string inputTickHandlerID of the InputTickHandler
 * @returns A string GroupID of the supplied InputTickHandlerGroup if it exists
 */
export const getInputTickHandlerGroupID = <GroupID extends string>(
  inputTickHandlerID: string,
): GroupID | null =>
  getDefinable<InputTickHandler<GroupID>>(
    InputTickHandler,
    inputTickHandlerID,
  ).getGroupID();
