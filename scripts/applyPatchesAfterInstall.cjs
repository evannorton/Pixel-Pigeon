"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const packageRoot = path.resolve(__dirname, "..");
const nestedNipplePath = path.join(packageRoot, "node_modules", "nipplejs");

const candidateRoots = [...new Set([process.cwd(), packageRoot])];

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

function linkNestedNippleToResolvedInstall(actualNippleDir) {
    if (pathsAreSamePath(nestedNipplePath, actualNippleDir) === true) {
        return;
    }
    fs.mkdirSync(path.join(packageRoot, "node_modules"), { recursive: true });
    removePathForReplace(nestedNipplePath);
    const absoluteTarget = path.resolve(actualNippleDir);
    if (process.platform === "win32") {
        fs.symlinkSync(absoluteTarget, nestedNipplePath, "junction");
        return;
    }
    const relativeTarget = path.relative(path.dirname(nestedNipplePath), absoluteTarget);
    fs.symlinkSync(relativeTarget, nestedNipplePath, "dir");
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

const actualNippleDir = resolvePackageDir("nipplejs");
if (actualNippleDir === null) {
    console.warn("[pixel-pigeon] nipplejs is not installed; skipping patches.");
    process.exit(0);
}

linkNestedNippleToResolvedInstall(actualNippleDir);

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
