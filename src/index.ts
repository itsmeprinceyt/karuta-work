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

const cooldowns = new Map<string, { lastUsed: number, penalty: number }>();

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

    const username: string = `${message.author.tag}`;
    const userId: string = message.author.id;
    const guildName: string = message.guild?.name ?? "DMs";
    const guildId: string = message.guild?.id ?? "DM";

    const now = Date.now();
    const cooldownData = cooldowns.get(userId);

    if (cooldownData) {
        const timePassed = now - cooldownData.lastUsed;

        if (timePassed < cooldownData.penalty) {
            cooldownData.penalty += 3000;
            cooldownData.lastUsed = now;
            cooldowns.set(userId, cooldownData);

            const unixTime = Math.floor((cooldownData.lastUsed + cooldownData.penalty) / 1000);
            await message.reply(`⏳ You can use the command again <t:${unixTime}:R>`);
            return;
        }
    }

    cooldowns.set(userId, { lastUsed: now, penalty: 3000 });

    setTimeout(() => {
        cooldowns.delete(userId);
    }, 30000);

    try {
        await command.execute(message, args.join(" "));
        console.log(`\n📥 Log\n-----------\nUser: ${username}\nUUID: ${userId}\nCommand: kk${trigger}\nLocation: ${guildName}\nLocation ID: ${guildId}\n-----------`);
    } catch (err) {
        console.error(`[ ERROR ] Command "${trigger}" failed for ${username}:`, err);
        await message.reply("There was an error executing that command.");
    }
});


client.login(process.env.DISCORD_BOT_TOKEN);