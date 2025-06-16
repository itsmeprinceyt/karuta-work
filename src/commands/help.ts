import { Message, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { COLOR_PRIMARY, YELLOW_EMBED } from "../utils/Colors";
import { BotName, DiscordProfileLink, GIF_LOCATION, GIF_NAME } from "../utils/utils";
import path from "path";
import { YouTubePromoEmbed } from "../utils/ytPromo";

export default {
    triggers: ["help"],
    async execute(message: Message) {
        const mainEmbed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: `${BotName} • Help`,
                iconURL: DiscordProfileLink
            })
            .setDescription(
                "**Available Commands:**\n\n" +
                "🍓 `kkabout ` – Shows about the bot.\n" +
                "🍓 `kkhelp  ` – Shows this help message.\n" +
                "🍓 `kkinvite` – Get the bot invite link.\n" +
                "🍓 `kkscan  ` – Scan your job board and summarize healthy/injured cards.\n" +
                "🍓 `kkwork  ` – Assign available cards to empty job board slots."
            );

        const howItWorksEmbed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setTitle("⚙️ How It Works")
            .setDescription(
                "1. Reply to your Job Board embed with `kkscan`\n" +
                "2. The bot checks which cards are healthy/injured.\n" +
                "3. Reply to the card collection embed with `kkwork` after doing `kc o:eff`\n" +
                "4. It will assign your free cards automatically to empty job slots."
            )
            .setFooter({text: "💡 Aliases or nicknamed cards won't be matched during scan."});

        const gifEmbed = new EmbedBuilder()
            .setColor(YELLOW_EMBED)
            .setTitle("🐱 Demonstration")
            .setImage(`attachment://${GIF_NAME}`);

        const gifPath = path.join(__dirname, GIF_LOCATION);
        const gif = new AttachmentBuilder(gifPath).setName(GIF_NAME);
        const { embed: ytEmbed, button: ytButton } = YouTubePromoEmbed();

        try {
            await message.reply({
                embeds: [mainEmbed, howItWorksEmbed, gifEmbed, ytEmbed],
                files: [gif],
                components: [ytButton],
            });
        } catch (error) {
            console.error("❌ Failed to send help message:", error);
        }
    },
};
