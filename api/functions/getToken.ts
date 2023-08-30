import { customAlphabet } from "nanoid";
import { tokenLength } from "pigeon-mode-game-framework/api/constants/tokenLength";
import { validIDCharacters } from "pigeon-mode-game-framework/api/constants/validIDCharacters";

export const getToken: () => string = customAlphabet(
  validIDCharacters.join(""),
  tokenLength,
);
