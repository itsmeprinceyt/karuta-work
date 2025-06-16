import { Client, GatewayIntentBits, Events, Message } from "discord.js";
import { config } from "dotenv";
import msgCommands from "./msgCommandHandler";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const prefix = "kk";

client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
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
        console.error(`[ ERROR ] Command "${trigger}" failed:`, err);
        await message.reply("There was an error executing that command.");
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);