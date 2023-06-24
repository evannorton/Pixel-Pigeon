# Pigeon Mode Game Library
Game library for EvanMMO's typescript games

![funny-dancing-pigeon-bird-9ykm83a04cil1x1l](https://github.com/evannorton/pigeon-mode-game-library/assets/35230033/3af48e87-34b8-4d1c-8af4-a7d5dbc1ce35)

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
