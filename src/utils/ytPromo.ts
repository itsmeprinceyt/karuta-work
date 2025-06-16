import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { YouTubeLink } from "./utils";
import { COLOR_PRIMARY } from "./Colors";

export function YouTubePromoEmbed() {
    const embed = new EmbedBuilder()
        .setColor(COLOR_PRIMARY)
        .setDescription("Support me by subscribing to my YouTube Channel");

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("📌 YouTube Channel")
            .setStyle(ButtonStyle.Link)
            .setURL(YouTubeLink)
    );

    return { embed, button };
}
