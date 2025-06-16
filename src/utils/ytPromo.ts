import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { YouTubeLink } from "./utils";
import { GOLDEN_EMBED } from "./Colors";

export function YouTubePromoEmbed() {
    const embed = new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("📺 Support me by subscribing to my YouTube Channel");

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("📌 Subscribe My YouTube")
            .setStyle(ButtonStyle.Link)
            .setURL(YouTubeLink)
    );

    return { embed, button };
}
