import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

interface MessageCommand {
    triggers: string[];
    execute: (message: any, args: string) => Promise<void>;
}

const msgCommands = new Collection<string, MessageCommand>();
const commandPath = join(__dirname, "commands");

const commandFiles = readdirSync(commandPath).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of commandFiles) {
    const commandModule = require(`${commandPath}/${file}`);
    const command: MessageCommand = commandModule.default;

    if (command && Array.isArray(command.triggers)) {
        for (const trigger of command.triggers) {
            msgCommands.set(trigger.toLowerCase(), command);
        }
    } else {
        console.warn(`[ WARN ] Skipping ${file}: Missing triggers or execute`);
    }
}

console.log(`[ INFO ] Loaded ${msgCommands.size} message command(s).`);
export default msgCommands;
