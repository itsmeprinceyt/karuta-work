"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllCardsHealthyEmbed = AllCardsHealthyEmbed;
exports.JobBoardSummary = JobBoardSummary;
exports.NotTriggeredByYou = NotTriggeredByYou;
exports.NoJobBoardFound = NoJobBoardFound;
exports.EmptyJobBoard = EmptyJobBoard;
exports.NoCardsFound = NoCardsFound;
const discord_js_1 = require("discord.js");
const Colors_1 = require("./Colors");
const utils_1 = require("./utils");
function AllCardsHealthyEmbed() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_TRUE)
        .setDescription("✅ All cards on your Job Board are already healthy.");
}
function JobBoardSummary(healthyCount, injuredCount) {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_TRUE)
        .setAuthor({
        name: utils_1.BotName,
        iconURL: utils_1.DiscordProfileLink
    })
        .setThumbnail(utils_1.DiscordProfileLink)
        .setDescription(`Here's the current status of your Job Board:\n\n` +
        `✅ **Healthy ${healthyCount === 1 ? "Card" : "Cards"}:** ${healthyCount}\n` +
        `❌ **Injured ${injuredCount === 1 ? "Card" : "Cards"}:** ${injuredCount}\n\n` +
        `To begin working, type \`kc o:eff\`, then reply to your collection with \`kkwork\`.\n` +
        `-# ⚠️ Note: This won't work on cards with aliases.`)
        .setTimestamp();
}
function NotTriggeredByYou() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ You can only use this command on an embed triggered by you.");
}
function NoJobBoardFound() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ No Job Board found. Please make sure you're replying to the correct embed message.");
}
function EmptyJobBoard() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ The Job Board appears to be empty or contains no valid cards.");
}
function NoCardsFound() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ No card codes were found in your \`kc o:eff\` message.");
}
