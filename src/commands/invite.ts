import { Message, EmbedBuilder } from "discord.js";
import { COLOR_PRIMARY } from "../utils/Colors";
import { BotName, DISCORD_BOT_INVITE_LINK, DiscordProfileLink } from "../utils/utils";
import { YouTubePromoEmbed } from "../utils/ytPromo";
import { config } from "dotenv";
config();

export default {
    triggers: ["invite"],
    async execute(message: Message) {
        const mainEmbed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: `${BotName} • Invite`,
                iconURL: DiscordProfileLink
            })
            .setThumbnail(DiscordProfileLink)
            .setDescription(
                `Streamline your Job Board management, and most importantly save time.\n\nInvite <@${process.env.APPLICATION_ID}> today!\n` +
                "🍓 [Click here to invite ](" + DISCORD_BOT_INVITE_LINK + ")"
            )

            .setTimestamp();

        const { embed: ytEmbed, button: ytButton } = YouTubePromoEmbed();

        try {
            await message.reply({
                embeds: [mainEmbed, ytEmbed],
                components: [ytButton]
            });
        } catch (error) {
            console.error("❌ Failed to send help message:", error);
        }
    },
};
