# Pixel Pigeon
Game engine for EvanMMO's typescript games.

![funny-dancing-pigeon-bird-9ykm83a04cil1x1l](https://github.com/evannorton/pixel-pigeon/assets/35230033/3af48e87-34b8-4d1c-8af4-a7d5dbc1ce35)

## Why make this?
Evan wanted something specifically tailored to low spec pixel perfect games.

## Getting started

You may use the [Template Game](https://github.com/evannorton/Pixel-Pigeon-Template) as a starting point, or create a repository from scratch using these instructions.

1. Install Node.js v20.12.2.
2. Create a `package.json` file at the root of your game's codebase.
```json
{
  "scripts": {
    "dev": "pigeon dev",
    "lint": "pigeon lint",
    "lint:fix": "pigeon lint:fix",
    "zip": "pigeon zip"
  },
  "dependencies": {
    "pixel-pigeon": "evannorton/pixel-pigeon"
  },
  "engines": {
    "npm": "10.5.0",
    "node": "20.12.2"
  }
}
```
3. Create a `pp-config.json` file at the root of your game's codebase.
```json
{
  "height": 360,
  "name": "My Cool Game",
  "requireClickToFocus": true,
  "width": 640
}
```
4. Create a `pp-dev.json` file at the root of your game's codebase.
```json
{
  "port": 3000,
  "renderPathing": false
}
```
5. Create a `pp-env.json` file at the root of your game's codebase.
```json
{
  "newgroundsAppID": null,
  "newgroundsEncryptionKey": null
}
```
6. Create a `project.ldtk` file at the root of your game's codebase, using the LDTK level editor.
7. Create a `.gitignore` file at the root of your game's codebase.
```
node_modules
pp-dev.json
game.zip
```
8. Create an `audio` folder at the root of your game's codebase.
9. Create an `images` folder at the root of your game's codebase.
10. Create a `src` folder at the root of your game's codebase.
11. Create `src/tsconfig.json`.
```
{
  "extends": "../node_modules/pixel-pigeon/api/tsconfig.json",
  "include": [
    "./**/*.ts"
  ]
}
```
12. Create an `index.ts` file inside of the `src` folder.
13. Run `npm install`.
14. Run `npm run dev` to start a dev server with hot reloading.
15. Explore the documentation: https://pp.evanmmo.com/

## Command line interface
### `pigeon dev`
Run your game on a local dev server with hot reloading.
### `pigeon zip`
Export a .zip folder of your game that can be uploaded to sites like itch.io and newgrounds.com.
### `pigeon lint`
Run the linter on your game's source code.
### `pigeon lint:fix`
Run the linter on your game's source code and automatically fix some errors.
### `pigeon png`
Remove unneeded chunks from your game's images.
### `pigeon id`
Generate a unique ID for your game. Achievements will not persist across sessions if you don't have an ID. Generating a new ID will cause players to lose their achievement data.

## Example games
- [RetroMMO](https://github.com/evannorton/RetroMMO-Screen) by [@evannorton](https://github.com/evannorton)
- [Dungeon Deli](https://github.com/evannorton/Dungeon-Deli) by [@evannorton](https://github.com/evannorton)

## ESLint VS Code extension
Create an `.eslintrc` with the following contents to use this extension. 
```json
{
  "parserOptions": {
    "project": "./src/tsconfig.json"
  },
  "extends": [
    "./node_modules/pixel-pigeon/.eslintrc"
  ],
  "rules": {
    "no-restricted-imports": [
      "off"
    ]
  }
}
```

## Running the engine locally
1. Follow the "getting started" instructions to create a game somewhere on your PC, e.g. `D:\Code\My-Awesome-Game`.
2. Clone the framework somewhere on your PC, e.g. `D:\Code\Pigeon-Mode-Game-Framework`.
3. Inside of the framework directory, run `npm link`.
4. Inside of the game directory, run `npm ci`.
5. Inside of the game directory, run `npm link pixel-pigeon`.
6. You can now run your game like normal with `pigeon dev`. You must manually rerun this every time you make a local change to the framework, as hot reloading only listens for changes to your game's code.
