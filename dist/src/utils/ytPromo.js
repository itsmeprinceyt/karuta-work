"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubePromoEmbed = YouTubePromoEmbed;
const discord_js_1 = require("discord.js");
const utils_1 = require("./utils");
const Colors_1 = require("./Colors");
function YouTubePromoEmbed() {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_PRIMARY)
        .setDescription("Support me by subscribing to my YouTube Channel");
    const button = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setLabel("📌 YouTube Channel")
        .setStyle(discord_js_1.ButtonStyle.Link)
        .setURL(utils_1.YouTubeLink));
    return { embed, button };
}
