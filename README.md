# pigeon-mode-game-library
Game library for EvanMMO's typescript games

## ESLint VS Code extension
Create an `.eslintrc` with the following contents to use this extension. 
```json
{
  "parserOptions": {
    "project": "./node_modules/pigeon-mode-game-library/game-tsconfig.json"
  },
  "extends": [
    "./node_modules/pigeon-mode-game-library/.eslintrc"
  ]
}
```