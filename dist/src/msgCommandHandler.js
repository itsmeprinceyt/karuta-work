"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const msgCommands = new discord_js_1.Collection();
// With "type": "commonjs" in package.json + updated tsx,
// this file is loaded as CJS and __dirname is available natively.
const commandPath = (0, node_path_1.join)(__dirname, "commands");
const commandFiles = (0, node_fs_1.readdirSync)(commandPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of commandFiles) {
    const fullPath = (0, node_path_1.join)(commandPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const commandModule = require(fullPath);
    const command = commandModule.default ?? commandModule;
    if (command && Array.isArray(command.triggers)) {
        for (const trigger of command.triggers) {
            msgCommands.set(trigger.toLowerCase(), command);
        }
    }
    else {
        console.warn(`[ WARN ] Skipping ${file}: Missing triggers or execute`);
    }
}
console.log(`[ INFO ] Loaded ${msgCommands.size} message command(s).`);
exports.default = msgCommands;
