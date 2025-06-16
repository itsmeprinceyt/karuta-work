import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: ["kkscan", "kkwork"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setDescription("Scan");

        try {
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Failed to send :", error);
        }
    },
};
