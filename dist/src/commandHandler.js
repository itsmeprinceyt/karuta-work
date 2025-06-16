"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const commands = new discord_js_1.Collection();
const commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "commands")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of commandFiles) {
    const commandModule = require(`./commands/${file}`);
    const command = commandModule.default;
    if (command && command.data) {
        commands.set(command.data.name, command);
    }
    else {
        console.warn(`[ ERROR ] Command at ${file} is missing "data" or "execute"!`);
    }
}
console.log(`[ INFO ] Commands are being loaded into the script. `);
exports.default = commands;
