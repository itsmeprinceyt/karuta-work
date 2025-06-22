"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Colors_1 = require("../utils/Colors");
const utils_1 = require("../utils/utils");
const ytPromo_1 = require("../utils/ytPromo");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    triggers: ["invite"],
    async execute(message) {
        const mainEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: `${utils_1.BotName} • Invite`,
            iconURL: utils_1.DiscordProfileLink,
        })
            .setThumbnail(utils_1.DiscordProfileLink)
            .setDescription(`Streamline your Job Board management, and most importantly save time.\n\nInvite <@${process.env.APPLICATION_ID}> today!\n` +
            "🍓 [Click here to invite ](" +
            utils_1.DISCORD_BOT_INVITE_LINK +
            ")")
            .setTimestamp();
        const inviteButton = new discord_js_1.ButtonBuilder()
            .setCustomId("get_invite_link")
            .setLabel("Get Invite Link")
            .setStyle(discord_js_1.ButtonStyle.Secondary);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(inviteButton);
        const { embed: ytEmbed, button: ytButton } = (0, ytPromo_1.YouTubePromoEmbed)();
        try {
            await message.reply({
                embeds: [mainEmbed, ytEmbed],
                components: [actionRow, ytButton],
            });
        }
        catch (error) {
            console.error("❌ Failed to send invite message:", error);
        }
    },
};
