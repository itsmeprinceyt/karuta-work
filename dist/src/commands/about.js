"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Colors_1 = require("../utils/Colors");
const utils_1 = require("../utils/utils");
const ytPromo_1 = require("../utils/ytPromo");
exports.default = {
    triggers: ["about"],
    async execute(message) {
        const mainEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: `${utils_1.BotName} • About`,
            iconURL: utils_1.DiscordProfileLink
        })
            .setThumbnail(utils_1.DiscordProfileLink)
            .setDescription(`${utils_1.BotName} is a utility bot designed to enhance your Karuta experience.\n\n` +
            "Easily manage your Job Board with simple commands like `kkscan` and `kkwork`.\n" +
            "Speed up card assignments, save time, and stay organized.\n\n" +
            `💡 Built by <@${utils_1.Creator}> to make your Karuta life easier!\n-# Type \`kkhelp\` to know more!`)
            .setTimestamp();
        const { embed: ytEmbed, button: ytButton } = (0, ytPromo_1.YouTubePromoEmbed)();
        try {
            await message.reply({
                embeds: [mainEmbed, ytEmbed],
                components: [ytButton],
            });
        }
        catch (error) {
            console.error("❌ Failed to send help message:", error);
        }
    },
};
