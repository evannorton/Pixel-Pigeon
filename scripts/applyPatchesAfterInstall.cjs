"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const packageRoot = path.resolve(__dirname, "..");

const candidateRoots = [...new Set([process.cwd(), packageRoot])];

const deps = ["nipplejs"];
const nestedPaths = deps.map(dep => path.join(packageRoot, "node_modules", dep));
const actualDirs = deps.map(dep => resolvePackageDir(dep));

function resolvePackageDir(packageName) {
    let resolved = null;
    for (const root of candidateRoots) {
        try {
            resolved = path.dirname(
                require.resolve(`${packageName}/package.json`, { paths: [root] }),
            );
            break;
        } catch {
            // try next root
        }
    }
    return resolved;
}

function pathsAreSamePath(pathA, pathB) {
    return path.resolve(pathA) === path.resolve(pathB);
}

function removePathForReplace(targetPath) {
    if (fs.existsSync(targetPath) === false) {
        return;
    }
    const stat = fs.lstatSync(targetPath);
    if (stat.isDirectory() === true || stat.isSymbolicLink() === true) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        return;
    }
    fs.unlinkSync(targetPath);
}

function linkNestedToResolvedInstall(actualDir, nestedPath) {
    if (pathsAreSamePath(nestedPath, actualDir) === true) {
        return;
    }
    fs.mkdirSync(path.join(packageRoot, "node_modules"), { recursive: true });
    removePathForReplace(nestedPath);
    const absoluteTarget = path.resolve(actualDir);
    if (process.platform === "win32") {
        fs.symlinkSync(absoluteTarget, nestedPath, "junction");
        return;
    }
    const relativeTarget = path.relative(path.dirname(nestedPath), absoluteTarget);
    fs.symlinkSync(relativeTarget, nestedPath, "dir");
}

function resolvePatchPackageEntry() {
    for (const root of candidateRoots) {
        try {
            const patchPackageDir = path.dirname(
                require.resolve("patch-package/package.json", { paths: [root] }),
            );
            return path.join(patchPackageDir, "index.js");
        } catch {
            // try next root
        }
    }
    throw new Error("Could not resolve patch-package entry script.");
}

for (const [index] of deps.entries()) {
    if (actualDirs[index] === null) {
        console.warn(`[pixel-pigeon] ${deps[index]} is not installed; skipping patches.`);
        process.exit(0);
    }
    linkNestedToResolvedInstall(actualDirs[index], nestedPaths[index]);
}

const patchPackageEntry = resolvePatchPackageEntry();
const patchResult = spawnSync(process.execPath, [patchPackageEntry], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
});
if (patchResult.error !== undefined) {
    console.error(patchResult.error);
    process.exit(1);
}
if (patchResult.status !== 0) {
    process.exit(patchResult.status === null ? 1 : patchResult.status);
}
