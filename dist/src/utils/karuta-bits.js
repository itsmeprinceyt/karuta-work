"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotTriggeredByYouBits = NotTriggeredByYouBits;
exports.NoBitsFound = NoBitsFound;
exports.InvalidInput = InvalidInput;
const discord_js_1 = require("discord.js");
const Colors_1 = require("./Colors");
function NotTriggeredByYouBits() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ You can only use this command on a bits embed triggered by you.");
}
function NoBitsFound() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ No bits data found. Please make sure you're replying to a valid bits embed.");
}
function InvalidInput() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ Invalid ratio format!\n\n**Usage:** \`kkbits <ratio>\`\n**Example:** \`kkbits 2350\`\n\nPlease provide a value above 1");
}
