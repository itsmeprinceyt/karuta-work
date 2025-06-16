"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function copyRecursive(src, dest) {
    (0, fs_1.mkdirSync)(dest, { recursive: true });
    const entries = (0, fs_1.readdirSync)(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = (0, path_1.join)(src, entry.name);
        const destPath = (0, path_1.join)(dest, entry.name);
        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        }
        else {
            (0, fs_1.copyFileSync)(srcPath, destPath);
        }
    }
}
copyRecursive("public", "dist/public");
console.log("✅ Copied 'public' folder to 'dist/public'");
