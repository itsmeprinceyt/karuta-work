import { Client, GatewayIntentBits, Events, Message } from "discord.js";
import { config } from "dotenv";
import msgCommands from "./msgCommandHandler";

config();

const PREFIX = "kk";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.reference || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const trigger = args.shift()?.toLowerCase();

    if (!trigger) return;
    const command = msgCommands.get(trigger);

    if (!command) {
        console.warn(`[ WARN ] Unknown command: ${trigger}`);
        return;
    }

    try {
        await command.execute(message, args.join(" "));
    } catch (err) {
        console.error(`[ ERROR ] Failed to execute command "${trigger}":`, err);
        await message.reply("There was an error executing that command.");
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
