import("nanoid").then(({ customAlphabet }) => {
  const { writeFileSync } = require("fs");
  const { join, resolve } = require("path");

  validIDCharacters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "Z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ];

  const id = customAlphabet(validIDCharacters.join(""), 21)();

  writeFileSync(join(resolve(), "pp-id.json"), JSON.stringify(id));
})