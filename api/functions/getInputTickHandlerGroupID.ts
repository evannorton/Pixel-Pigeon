import InputTickHandler from "pigeon-mode-game-library/api/classes/InputTickHandler";
import getDefinable from "pigeon-mode-game-library/api/functions/getDefinable";

const getInputTickHandlerGroupID = <GroupID extends string>(
  inputTickHandlerID: string
): GroupID | null =>
  getDefinable<InputTickHandler<GroupID>>(
    InputTickHandler,
    inputTickHandlerID
  ).getGroupID();

export default getInputTickHandlerGroupID;
