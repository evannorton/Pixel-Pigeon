# pigeon-mode-game-library
Game library for EvanMMO's typescript games

## Command line interface

### `pigeon dev`
Run your game on a local dev server with hot reloading.
### `pigeon zip`
Export a .zip folder of your game that can be uploaded to sites like itch.io and newgrounds.com.
### `pigeon lint`
Run the linter on your game's source code.
### `pigeon lint:fix`
Run the linter on your game's source code and automatically fix some errors.

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