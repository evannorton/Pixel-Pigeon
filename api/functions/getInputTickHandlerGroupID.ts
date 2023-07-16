import InputTickHandler from "../classes/InputTickHandler";
import getDefinable from "./getDefinable";

const getInputTickHandlerGroupID = <GroupID extends string>(
  inputTickHandlerID: string
): GroupID | null =>
  getDefinable<InputTickHandler<GroupID>>(
    InputTickHandler,
    inputTickHandlerID
  ).getGroupID();

export default getInputTickHandlerGroupID;
