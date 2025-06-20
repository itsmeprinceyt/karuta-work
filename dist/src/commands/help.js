"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Colors_1 = require("../utils/Colors");
const utils_1 = require("../utils/utils");
const path_1 = __importDefault(require("path"));
const ytPromo_1 = require("../utils/ytPromo");
exports.default = {
    triggers: ["help"],
    async execute(message) {
        const mainEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: `${utils_1.BotName} • Help`,
            iconURL: utils_1.DiscordProfileLink
        })
            .setDescription("**Available Commands:**\n\n" +
            "🍓 `kkabout ` – Shows about the bot.\n" +
            "🍓 `kkhelp  ` – Shows this help message.\n" +
            "🍓 `kkinvite` – Get the bot invite link.\n" +
            "🍓 `kkscan  ` – Scan your job board and summarize healthy/injured cards.\n" +
            "🍓 `kkwork  ` – Assign available cards to empty job board slots.");
        const howItWorksEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setTitle("⚙️ How It Works")
            .setDescription("1. Reply to your Job Board embed with `kkscan`\n" +
            "2. The bot checks which cards are healthy/injured.\n" +
            "3. Reply to the card collection embed with `kkwork` after doing `kc o:eff`\n" +
            "4. It will assign your free cards automatically to empty job slots.")
            .setFooter({ text: "💡 Aliases or nicknamed cards won't be matched during scan." });
        const gifEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.YELLOW_EMBED)
            .setTitle("🐱 Demonstration")
            .setImage(`attachment://${utils_1.GIF_NAME}`);
        const gifPath = path_1.default.join(__dirname, utils_1.GIF_LOCATION);
        const gif = new discord_js_1.AttachmentBuilder(gifPath).setName(utils_1.GIF_NAME);
        const { embed: ytEmbed, button: ytButton } = (0, ytPromo_1.YouTubePromoEmbed)();
        try {
            await message.reply({
                embeds: [mainEmbed, howItWorksEmbed, gifEmbed, ytEmbed],
                files: [gif],
                components: [ytButton],
            });
        }
        catch (error) {
            console.error("❌ Failed to send help message:", error);
        }
    },
};
