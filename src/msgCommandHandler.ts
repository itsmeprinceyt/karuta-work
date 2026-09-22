import { Collection } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";

interface MessageCommand {
  triggers: string[];
  execute: (message: any, args: string) => Promise<void>;
}

const msgCommands = new Collection<string, MessageCommand>();

// With "type": "commonjs" in package.json + updated tsx,
// this file is loaded as CJS and __dirname is available natively.
const commandPath = join(__dirname, "commands");

const commandFiles = readdirSync(commandPath).filter(
  (file) => file.endsWith(".ts") || file.endsWith(".js"),
);

for (const file of commandFiles) {
  const fullPath = join(commandPath, file);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const commandModule = require(fullPath);
  const command: MessageCommand = commandModule.default ?? commandModule;

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
