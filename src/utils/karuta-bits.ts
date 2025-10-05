import { EmbedBuilder } from "discord.js";
import { GOLDEN_EMBED } from "./Colors";

export function NotTriggeredByYouBits(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ You can only use this command on a bits embed triggered by you.");
}

export function NoBitsFound(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ No bits data found. Please make sure you're replying to a valid bits embed.");
}

export function InvalidInput(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ Invalid ratio format!\n\n**Usage:** \`kkbits <ratio>\`\n**Example:** \`kkbits 2350\`\n\nPlease provide a value above 1");
}