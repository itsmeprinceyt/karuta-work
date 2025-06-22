import { ButtonInteraction } from "discord.js";
import { DISCORD_BOT_INVITE_LINK } from "./utils/utils";

export const buttonHandlers: Record<string, (interaction: ButtonInteraction) => Promise<void>> = {
    get_invite_link: async (interaction) => {
        await interaction.reply({
            content: `${DISCORD_BOT_INVITE_LINK}`,
            flags: 64,
        });
    },
};
