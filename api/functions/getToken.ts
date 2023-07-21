import { customAlphabet } from "nanoid";
import { tokenLength } from "../constants/tokenLength";
import { validIDCharacters } from "../constants/validIDCharacters";

export const getToken: () => string = customAlphabet(
  validIDCharacters.join(""),
  tokenLength,
);
