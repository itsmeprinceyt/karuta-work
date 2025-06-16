"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const msgCommands = new discord_js_1.Collection();
const commandPath = (0, path_1.join)(__dirname, "commands");
const commandFiles = (0, fs_1.readdirSync)(commandPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of commandFiles) {
    const commandModule = require(`${commandPath}/${file}`);
    const command = commandModule.default;
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
