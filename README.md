# Pigeon Mode Game Framework
Game framework for EvanMMO's typescript games.

![funny-dancing-pigeon-bird-9ykm83a04cil1x1l](https://github.com/evannorton/pigeon-mode-game-framework/assets/35230033/3af48e87-34b8-4d1c-8af4-a7d5dbc1ce35)

## Why make this?
Evan wanted something specifically tailored to low spec pixel perfect games.

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
    "pigeon-mode-game-framework": "evannorton/pigeon-mode-game-framework"
  },
  "engines": {
    "npm": "9.5.1",
    "node": "18.16.0"
  }
}
```

2. Create a `config.pmgf` file at the root of your game's codebase.
```json
{
  "height": 360,
  "width": 640
}
```

3. Create a `project.ldtk` file at the root of your game's codebase, using the LDTK level editor.

4. Create a `.gitignore` file at the root of your game's codebase.
```
node_modules
game.zip
```

5. Create an `audio` folder at the root of your game's codebase.

6. Create an `images` folder at the root of your game's codebase.

7. Create a `src` folder at the root of your game's codebase.

8. Create an `index.ts` file inside of the `src` folder.

9. Run `npm install`.

10. Run `npm run dev` to start a dev server with hot reloading on port 3000.

11. Explore the documentation: https://evannorton.github.io/Pigeon-Mode-Game-Framework/

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
- [Moon Squid](https://github.com/evannorton/Moon-Squid) by [@evannorton](https://github.com/evannorton)

## ESLint VS Code extension
Create an `.eslintrc` with the following contents to use this extension. 
```json
{
  "parserOptions": {
    "project": "./node_modules/pigeon-mode-game-framework/game-tsconfig.json"
  },
  "extends": [
    "./node_modules/pigeon-mode-game-framework/.eslintrc"
  ],
  "rules": {
    "no-restricted-imports": [
      "off"
    ]
  }
}
```
