import { EmbedBuilder } from "discord.js";
import { COLOR_TRUE, GOLDEN_EMBED } from "./Colors";
import { BotName, DiscordProfileLink } from "./utils";

export function AllCardsHealthyEmbed(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(COLOR_TRUE)
        .setDescription("✅ All cards on your Job Board are already healthy.");
}

export function JobBoardSummary(healthyCount: number, injuredCount: number): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(COLOR_TRUE)
        .setAuthor({
            name: BotName,
            iconURL: DiscordProfileLink})
        .setThumbnail(DiscordProfileLink)
        .setDescription(
            `Here's the current status of your Job Board:\n\n` +
            `✅ **Healthy ${healthyCount === 1 ? "Card" : "Cards"}:** ${healthyCount}\n` +
            `❌ **Injured ${injuredCount === 1 ? "Card" : "Cards"}:** ${injuredCount}\n\n` +
            `To begin working, type \`kc o:eff\`, then reply to your collection with \`kkwork\`.\n` +
            `-# ⚠️ Note: This won't work on cards with aliases.`
        )
        .setTimestamp();
}

export function NotTriggeredByYou(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ You can only use this command on an embed triggered by you.");
}

export function NoJobBoardFound(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ No Job Board found. Please make sure you're replying to the correct embed message.");
}

export function EmptyJobBoard(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ The Job Board appears to be empty or contains no valid cards.");
}

export function NoCardsFound(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ No card codes were found in your \`kc o:eff\` message.");
}
