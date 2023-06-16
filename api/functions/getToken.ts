import { customAlphabet } from "nanoid";
import tokenLength from "../constants/tokenLength";
import validSlugCharacters from "../constants/validSlugCharacters";

const getToken: () => string = customAlphabet(validSlugCharacters.join(""), tokenLength);

export default getToken;