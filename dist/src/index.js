"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const msgCommandHandler_1 = __importDefault(require("./msgCommandHandler"));
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
const prefix = "kk";
client.once(discord_js_1.Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});
const cooldowns = new Map();
client.on(discord_js_1.Events.MessageCreate, async (message) => {
    if (message.author.bot)
        return;
    if (message.content.slice(0, prefix.length).toLowerCase() !== prefix)
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const trigger = args.shift()?.toLowerCase();
    if (!trigger)
        return;
    const command = msgCommandHandler_1.default.get(trigger);
    if (!command) {
        console.warn(`[ WARN ] Unknown command: ${trigger}`);
        return;
    }
    const username = `${message.author.tag}`;
    const userId = message.author.id;
    const guildName = message.guild?.name ?? "DMs";
    const guildId = message.guild?.id ?? "DM";
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
    }
    catch (err) {
        console.error(`[ ERROR ] Command "${trigger}" failed for ${username}:`, err);
        await message.reply("There was an error executing that command.");
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
