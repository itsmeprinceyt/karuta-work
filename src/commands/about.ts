import { Message, EmbedBuilder } from "discord.js";
import { COLOR_PRIMARY } from "../utils/Colors";
import { BotName, Creator, DiscordProfileLink } from "../utils/utils";
import { YouTubePromoEmbed } from "../utils/ytPromo";

export default {
    triggers: ["about"],
    async execute(message: Message) {
        const mainEmbed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: `${BotName} • About`,
                iconURL: DiscordProfileLink
            })
            .setThumbnail(DiscordProfileLink)
            .setDescription(
                `${BotName} is a utility bot designed to enhance your Karuta experience.\n\n` +
                "Easily manage your Job Board with simple commands like `kkscan` and `kkwork`.\n" +
                "Speed up card assignments, save time, and stay organized.\n\n" +
                `💡 Built by <@${Creator}> to make your Karuta life easier!\n-# Type \`kkhelp\` to know more!`
            )
            .setTimestamp();

        const { embed: ytEmbed, button: ytButton } = YouTubePromoEmbed();

        try {
            await message.reply({
                embeds: [mainEmbed, ytEmbed],
                components: [ytButton],
            });
        } catch (error) {
            console.error("❌ Failed to send help message:", error);
        }
    },
};
