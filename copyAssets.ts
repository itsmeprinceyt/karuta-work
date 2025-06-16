import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

function copyRecursive(src: string, dest: string) {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    }
}

copyRecursive("public", "dist/public");
console.log("✅ Copied 'public' folder to 'dist/public'");
