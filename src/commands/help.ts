import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: ["help", "kkhelp"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setTitle("Help")
            .setDescription("This is a help command.");

        try {
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Failed to send help message:", error);
        }
    },
};
