# Pigeon Mode Game Library
Game library for EvanMMO's typescript games

![funny-dancing-pigeon-bird-9ykm83a04cil1x1l](https://github.com/evannorton/pigeon-mode-game-library/assets/35230033/3af48e87-34b8-4d1c-8af4-a7d5dbc1ce35)

## Getting started
1. Create a `package.json` file at the root of your game's codebase.
```json
{
  "scripts": {
    "dev": "pigeon dev",
    "lint": "pigeon lint",
    "lint:fix": "pigeon lint:fix",
    "zip": "pigeon zip"
  },
  "dependencies": {
    "pigeon-mode-game-library": "evannorton/pigeon-mode-game-library"
  },
  "engines": {
    "npm": "9.5.1",
    "node": "18.16.0"
  }
}
```

2. Create a `config.pmgl` file at the root of your game's codebase.
```json
{
  // Base height of your game in pixels
  "height": 360,
  // Base width of your game in pixels
  "width": 640
}
```

3. Create a `.gitignore` file at the root of your game's codebase.
```
node_modules
game.zip
```

4. Create a `images` folder at the root of your game's codebase.

5. Run `npm install`.

6. Run `npm run dev` to start a dev server with hot-reloading on port 3000.

## Command line interface

### `pigeon dev`
Run your game on a local dev server with hot reloading.
### `pigeon zip`
Export a .zip folder of your game that can be uploaded to sites like itch.io and newgrounds.com.
### `pigeon lint`
Run the linter on your game's source code.
### `pigeon lint:fix`
Run the linter on your game's source code and automatically fix some errors.

## Example games
- [EvanMMO - Moon Squid](https://github.com/evannorton/Moon-Squid)

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
