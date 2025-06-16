import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

interface MessageCommand {
    triggers: string[];
    execute: (message: any, args: string) => Promise<void>;
}

const msgCommands = new Collection<string, MessageCommand>();

const commandFolders = ["commands"];

for (const folder of commandFolders) {
    const commandPath = join(__dirname, folder);
    const commandFiles = readdirSync(commandPath).filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js")
    );

    for (const file of commandFiles) {
        const commandModule = require(`${commandPath}/${file}`);
        const command: MessageCommand = commandModule.default;

        if (command && Array.isArray(command.triggers)) {
            for (const trigger of command.triggers) {
                msgCommands.set(trigger, command);
            }
        } else {
            console.warn(`[ ERROR ] Message command ${file} in ${folder} is missing "triggers" or "execute"!`);
        }
    }
}

console.log(`[ INFO ] Registering Message commands. | Commands: ${msgCommands.size}`);
export default msgCommands;
