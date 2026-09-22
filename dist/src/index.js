"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const msgCommandHandler_1 = __importDefault(require("./msgCommandHandler"));
const buttonHandlers_1 = require("./buttonHandlers");
const bits_1 = require("./commands/bits");
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
    console.log(`[ READY ] Logged in as ${client.user?.tag} (${client.user?.id})`);
});
const cooldowns = new Map();
client.on(discord_js_1.Events.MessageCreate, async (message) => {
    if (message.author.bot)
        return;
    if (!message.content.toLowerCase().startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const trigger = args.shift()?.toLowerCase();
    if (!trigger)
        return;
    const command = msgCommandHandler_1.default.get(trigger);
    if (!command) {
        console.warn(`[ WARN ] Unknown command: kk${trigger} (user: ${message.author.tag})`);
        return;
    }
    const userId = message.author.id;
    const now = Date.now();
    const cooldownData = cooldowns.get(userId);
    if (cooldownData) {
        const timePassed = now - cooldownData.lastUsed;
        if (timePassed < cooldownData.penalty) {
            cooldownData.penalty += 3000;
            cooldownData.lastUsed = now;
            cooldowns.set(userId, cooldownData);
            const unixTime = Math.floor((cooldownData.lastUsed + cooldownData.penalty) / 1000);
            console.warn(`[ COOLDOWN ] ${message.author.tag} hit cooldown on kk${trigger} (penalty now ${cooldownData.penalty}ms)`);
            await message.reply(`⏳ You can use the command again <t:${unixTime}:R>`);
            return;
        }
    }
    cooldowns.set(userId, { lastUsed: now, penalty: 3000 });
    setTimeout(() => {
        cooldowns.delete(userId);
    }, 30000);
    const startTime = Date.now();
    try {
        await command.execute(message, args.join(" "));
        const elapsed = Date.now() - startTime;
        console.log(`[ CMD ] kk${trigger} | ${message.author.tag} (${userId}) | ` +
            `${message.guild?.name ?? "DMs"} (${message.guild?.id ?? "DM"}) | ${elapsed}ms`);
    }
    catch (err) {
        console.error(`[ ERROR ] Command "kk${trigger}" failed for ${message.author.tag}:`, err);
        await message
            .reply("There was an error executing that command.")
            .catch(() => { });
    }
});
client.on(discord_js_1.Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (newMessage.partial)
        await newMessage.fetch();
    if (oldMessage.partial)
        await oldMessage.fetch();
    await (0, bits_1.handleMessageUpdate)(oldMessage, newMessage);
});
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton())
        return;
    const handler = buttonHandlers_1.buttonHandlers[interaction.customId];
    if (!handler)
        return;
    try {
        await handler(interaction);
    }
    catch (error) {
        console.error(`[ ERROR ] Failed to handle button "${interaction.customId}":`, error);
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
